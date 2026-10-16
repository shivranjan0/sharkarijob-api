import { createHash } from 'node:crypto';
const buckets = new Map();
const MAX_KEY_LENGTH = 128;
const MAX_BUCKETS = 50_000;
function normalizeKeyPart(value) {
    const str = String(value ?? '');
    if (str.length <= MAX_KEY_LENGTH)
        return str;
    return createHash('sha256').update(str).digest('base64url');
}
function dropExpired(now) {
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now)
            buckets.delete(key);
    }
}
setInterval(() => dropExpired(Date.now()), 10 * 60 * 1000).unref();
export default class RateLimitMiddleware {
    async handle(ctx, next, options = {}) {
        const max = options.max ?? 10;
        const windowMs = options.windowMs ?? 60_000;
        const scope = options.scope ?? 'default';
        const extra = typeof options.key === 'function' ? options.key(ctx) : undefined;
        const ipPart = options.perIp === false ? '' : ctx.request.ip();
        const bucketKey = `${scope}:${normalizeKeyPart(ipPart)}${extra ? `:${normalizeKeyPart(extra)}` : ''}`;
        const now = Date.now();
        const bucket = buckets.get(bucketKey);
        if (!bucket || bucket.resetAt <= now) {
            if (buckets.size >= MAX_BUCKETS) {
                dropExpired(now);
                if (buckets.size >= MAX_BUCKETS) {
                    ctx.response.header('Retry-After', '60');
                    return ctx.response.tooManyRequests({
                        message: 'Too many attempts. Please wait before trying again.',
                        retryAfter: 60,
                    });
                }
            }
            buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
        }
        else {
            bucket.count += 1;
            if (bucket.count > max) {
                const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
                ctx.response.header('Retry-After', String(retryAfter));
                return ctx.response.tooManyRequests({
                    message: 'Too many attempts. Please wait before trying again.',
                    retryAfter,
                });
            }
        }
        return next();
    }
}
//# sourceMappingURL=rate_limit_middleware.js.map