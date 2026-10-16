export default class RejectMultipartMiddleware {
    async handle(ctx, next) {
        if (ctx.request.is(['multipart/form-data'])) {
            return ctx.response.unsupportedMediaType({
                message: 'File uploads are not accepted by this API.',
            });
        }
        return next();
    }
}
//# sourceMappingURL=reject_multipart_middleware.js.map