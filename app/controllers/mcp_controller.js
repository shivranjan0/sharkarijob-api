import { createHash, timingSafeEqual } from 'node:crypto';
import env from '#start/env';
import { TOOLS, TOOLS_BY_NAME } from '#services/mcp/tools';
const PARSE_ERROR = -32700;
const INVALID_REQUEST = -32600;
const METHOD_NOT_FOUND = -32601;
const PROTOCOL_VERSION = '2025-06-18';
export default class McpController {
    keyMatches(given, expected) {
        const a = createHash('sha256').update(given).digest();
        const b = createHash('sha256').update(expected).digest();
        return timingSafeEqual(a, b);
    }
    configuredKey() {
        return String(env.get('MCP_CONNECTOR_KEY') ?? '').trim();
    }
    authorised(params) {
        const expected = this.configuredKey();
        if (!expected || expected.length < 24)
            return false;
        return this.keyMatches(String(params.key ?? '').trim(), expected);
    }
    rpcError(id, code, message) {
        return { jsonrpc: '2.0', id: id ?? null, error: { code, message } };
    }
    toolResult(value) {
        const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
        let structuredContent;
        if (Array.isArray(value))
            structuredContent = { items: value };
        else if (typeof value === 'object' && value !== null)
            structuredContent = value;
        else
            structuredContent = { value };
        return { content: [{ type: 'text', text }], structuredContent };
    }
    toolFailure(message) {
        return { content: [{ type: 'text', text: message }], isError: true };
    }
    async status({ response }) {
        const raw = String(env.get('MCP_CONNECTOR_KEY') ?? '');
        const key = raw.trim();
        return response.ok({
            configured: key.length >= 24,
            keyLength: key.length,
            hadSurroundingWhitespace: raw !== key,
            endpoint: '/mcp/<key>',
        });
    }
    async stream({ params, response }) {
        if (!this.authorised(params))
            return response.notFound({ error: 'Not found' });
        return response.methodNotAllowed({ error: 'This server does not offer an SSE stream' });
    }
    async handle({ params, request, response }) {
        if (!this.authorised(params)) {
            return response.notFound({ error: 'Not found' });
        }
        const body = request.body();
        if (!body || typeof body !== 'object') {
            return response.ok(this.rpcError(null, PARSE_ERROR, 'Expected a JSON-RPC object'));
        }
        if (Array.isArray(body)) {
            const results = [];
            for (const message of body) {
                const result = await this.dispatch(message);
                if (result)
                    results.push(result);
            }
            return results.length ? response.ok(results) : response.noContent();
        }
        const result = await this.dispatch(body);
        if (!result)
            return response.accepted({});
        return response.ok(result);
    }
    async dispatch(message) {
        if (!message || typeof message !== 'object') {
            return this.rpcError(null, INVALID_REQUEST, 'Expected a JSON-RPC object');
        }
        const { id, method } = message;
        const isNotification = id === undefined || id === null;
        switch (method) {
            case 'initialize':
                return {
                    jsonrpc: '2.0',
                    id,
                    result: {
                        protocolVersion: PROTOCOL_VERSION,
                        capabilities: { tools: { listChanged: false } },
                        serverInfo: {
                            name: 'sharkari-job',
                            title: 'Sharkari Job',
                            version: '1.0.0',
                        },
                        instructions: 'Content management for sharkarijob.online, a Sarkari Naukri notice board.\n\n' +
                            'Read before you write: call list_categories for the category ids, and ' +
                            'list_posts or get_post to find the row you mean, rather than guessing an id.\n\n' +
                            'Write post and article bodies as `sections`, not as HTML. Sections render ' +
                            'into the same blocks the existing 700-odd posts use, which is what keeps a ' +
                            'new post looking like the rest of the site. `contentHtml` exists for ' +
                            'migrating content that already exists and is cleaned on the way in.\n\n' +
                            'Meta title, description, keywords, the slug and JobPosting structured data ' +
                            'are generated from the post unless you pass your own, so a post is never ' +
                            'published without them.\n\n' +
                            'New posts are drafts unless status is set to "published". Deletes are ' +
                            'permanent and break the public URL: to take something off the site while ' +
                            'keeping it, set status to "draft" instead. Confirm with the operator before ' +
                            'deleting anything.',
                    },
                };
            case 'notifications/initialized':
            case 'notifications/cancelled':
                return null;
            case 'ping':
                return { jsonrpc: '2.0', id, result: {} };
            case 'tools/list':
                return {
                    jsonrpc: '2.0',
                    id,
                    result: {
                        tools: TOOLS.map((tool) => ({
                            name: tool.name,
                            title: tool.title,
                            description: tool.description,
                            inputSchema: tool.inputSchema,
                            annotations: {
                                readOnlyHint: !tool.destructive && tool.name.startsWith('list_')
                                    ? true
                                    : tool.name.startsWith('get_') || tool.name === 'preview_content',
                                destructiveHint: Boolean(tool.destructive),
                            },
                        })),
                    },
                };
            case 'tools/call': {
                const name = message.params?.name;
                const tool = TOOLS_BY_NAME.get(String(name));
                if (!tool) {
                    return {
                        jsonrpc: '2.0',
                        id,
                        result: this.toolFailure(`No tool named "${name}". Call tools/list to see what is available.`),
                    };
                }
                try {
                    const value = await tool.handler(message.params?.arguments ?? {});
                    return { jsonrpc: '2.0', id, result: this.toolResult(value) };
                }
                catch (error) {
                    const known = error instanceof Error ? error.message : 'Unknown error';
                    return { jsonrpc: '2.0', id, result: this.toolFailure(known) };
                }
            }
            case 'resources/list':
            case 'prompts/list':
                return { jsonrpc: '2.0', id, result: { [method.split('/')[0]]: [] } };
            default:
                if (isNotification)
                    return null;
                return this.rpcError(id, METHOD_NOT_FOUND, `Unknown method "${method}"`);
        }
    }
}
//# sourceMappingURL=mcp_controller.js.map