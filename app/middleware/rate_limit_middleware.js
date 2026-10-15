import { createHash } from 'node:crypto';
// A small in-memory, fixed-window rate limiter.
//
// This API runs as a single Node process, so an in-memory counter is enough
// to stop fast, scripted brute-forcing of login/2FA without adding a new
// dependency or a Redis requirement. If this is ever deployed as more than
// one process/instance, swap this for a shared store (e.g. a Redis-backed
// limiter) so the counters are seen by every instance.
//
// IMPORTANT: every bucket is keyed partly on `ctx.request.ip()`. That is only
// the real caller when `trustProxy` in config/app.js actually describes the
// proxies in front of this process -- see the notes there. Behind an
// unconfigured proxy every request shares one IP, which turns an IP-only
// limit into a site-wide limit, so prefer keying on a per-account value
// (email, user id) wherever one is available.
const buckets = new Map();
// Bucket keys contain caller-supplied data (an email, a 2FA challenge), so
// the number of distinct keys and the length of each one are both attacker
// controlled. Cap both: hash anything long down to a fixed size, and stop
// the Map from growing without bound.
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
// Periodically drop expired buckets so long-running processes don't
// accumulate one entry per distinct IP/account forever.
setInterval(() => dropExpired(Date.now()), 10 * 60 * 1000).unref();
export default class RateLimitMiddleware {
    async handle(ctx, next, options = {}) {
        const max = options.max ?? 10;
        const windowMs = options.windowMs ?? 60_000;
        const scope = options.scope ?? 'default';
        const extra = typeof options.key === 'function' ? options.key(ctx) : undefined;
        // `perIp: false` drops the address from the key, for a bucket that
        // should follow the account instead (a signed-in user behind a shared
        // NAT or CDN edge must not be throttled by a stranger's attempts).
        const ipPart = options.perIp === false ? '' : ctx.request.ip();
        const bucketKey = `${scope}:${normalizeKeyPart(ipPart)}${extra ? `:${normalizeKeyPart(extra)}` : ''}`;
        const now = Date.now();
        const bucket = buckets.get(bucketKey);
        if (!bucket || bucket.resetAt <= now) {
            if (buckets.size >= MAX_BUCKETS) {
                // Reclaim what has already lapsed before giving up on a new
                // entry. If the table is still full the window is being
                // flooded with distinct keys, so fail closed rather than let
                // the process grow until it is OOM-killed.
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
