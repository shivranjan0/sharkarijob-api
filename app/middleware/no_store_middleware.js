export default class NoStoreMiddleware {
    async handle(ctx, next) {
        ctx.response.header('Cache-Control', 'no-store');
        return next();
    }
}
//# sourceMappingURL=no_store_middleware.js.map