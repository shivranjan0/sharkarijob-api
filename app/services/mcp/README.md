# MCP connector

Lets an MCP client (Claude, via a custom connector) read and write the site's
content: posts, blog articles, CMS pages, categories and the contact inbox.

## Setting it up

1. Generate a key — it is the credential and it lives in the URL, so it has to
   be long and random:

   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Add it to the API's environment (on Render: Environment → Add):

   ```
   MCP_CONNECTOR_KEY=<the key>
   ```

   Unset, or shorter than 24 characters, and `/mcp/*` returns 404. That is the
   off switch — there is no separate feature flag.

3. In claude.ai → Settings → Connectors → Add custom connector, give it:

   ```
   https://api.sharkarijob.online/mcp/<the key>
   ```

## Why the key is in the URL

A remote connector that is not doing an OAuth handshake has nowhere else to put
a credential. The consequence is that **the URL is the secret**: anyone holding
it has full write access to the site's content. Treat it like a password — do
not paste it into a chat, a ticket or a screenshot. To revoke it, change
`MCP_CONNECTOR_KEY` and redeploy; the old URL stops working immediately.

A wrong key returns 404 rather than 401, so the endpoint does not confirm it
exists to someone guessing, and the comparison is timing-safe.

## Layout

| File | What it does |
| --- | --- |
| `content_format.ts` | Renders `sections` into the site's own HTML blocks; cleans pasted HTML |
| `seo_fields.ts` | Slug, meta title/description/keywords, JobPosting structured data |
| `tools.ts` | The tools themselves — thin wrappers over the same models the admin panel uses |
| `../../controllers/mcp_controller.ts` | JSON-RPC transport and auth |

## The two things this adds over the admin panel

**Format.** Tools take `sections`, not HTML. Each section renders into the
blocks the existing posts are made of — the one-column titled card, the
two-column dates/fee table, the vacancy grid, the Important Links table — which
`content-typography.css` is written against. A post written through the
connector is the same shape as the other 700.

`contentHtml` exists for migrating content that already exists. It is cleaned on
the way in: scripts, styles, event handlers, `javascript:` URLs, competitor
references, and the pasted layout classes that had to be stripped from 262 live
posts as a one-off. Doing it on ingest is what stops that recurring.

**SEO.** Meta title, description, keywords, the slug and JobPosting structured
data are generated from the post unless explicit values are given, so nothing is
published with them empty — which is the state the whole site was in before.

## Limits worth knowing

- **No image upload.** There is no object storage attached; Render's disk is
  ephemeral. Image fields take absolute URLs to something already hosted.
- **`normaliseHtml` is regex, not a parser.** AdonisJS runs without a DOM. It is
  tidying plus defence in depth behind an authenticated endpoint, not a
  sanitiser to rely on — which is why `sections`, where nothing but escaped text
  and a short list of generated tags can reach a page, is the path the tool
  descriptions push callers towards.
- **No audit trail.** Writes are not attributed to a user; the connector is a
  single identity.
