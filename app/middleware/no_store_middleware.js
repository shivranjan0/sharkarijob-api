// Authenticated responses (account data, admin panel data) should never be
// cached by a shared proxy or kept around in browser disk cache.
export default class NoStoreMiddleware {
    async handle(ctx, next) {
        ctx.response.header('Cache-Control', 'no-store');
        return next();
    }
}
