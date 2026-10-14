export default class AdminMiddleware {
    async handle(ctx, next) {
        const user = ctx.auth.user;
        if (!user) {
            return ctx.response.unauthorized({ message: 'Authentication required' });
        }
        if (!user.isAdmin) {
            return ctx.response.forbidden({ message: 'Admin access required' });
        }
        if (!user.twoFactorEnabled) {
            return ctx.response.forbidden({
                code: 'TWO_FACTOR_REQUIRED',
                message: 'Set up two-factor authentication to use the admin panel.',
            });
        }
        return next();
    }
}
//# sourceMappingURL=admin_middleware.js.map