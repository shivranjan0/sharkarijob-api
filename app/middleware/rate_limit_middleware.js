// A small in-memory, fixed-window rate limiter.
//
// This API runs as a single Node process, so an in-memory counter is enough
// to stop fast, scripted brute-forcing of login/2FA without adding a new
// dependency or a Redis requirement. If this is ever deployed as more than
// one process/instance, swap this for a shared store (e.g. a Redis-backed
// limiter) so the counters are seen by every instance.
const buckets = new Map();
// Periodically drop expired buckets so long-running processes don't
// accumulate one entry per distinct IP/account forever.
setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now)
            buckets.delete(key);
    }
}, 10 * 60 * 1000).unref();
export default class RateLimitMiddleware {
    async handle(ctx, next, options = {}) {
        const max = options.max ?? 10;
        const windowMs = options.windowMs ?? 60_000;
        const scope = options.scope ?? 'default';
        const extra = typeof options.key === 'function' ? options.key(ctx) : undefined;
        const bucketKey = `${scope}:${ctx.request.ip()}${extra ? `:${extra}` : ''}`;
        const now = Date.now();
        const bucket = buckets.get(bucketKey);
        if (!bucket || bucket.resetAt <= now) {
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
