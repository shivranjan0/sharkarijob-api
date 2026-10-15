// Nothing in this API accepts a file. Without this, any unauthenticated
// caller could POST a multipart body to any endpoint and have the whole
// thing (up to the bodyparser limit) streamed to a temp file on disk --
// body parsing is router-level middleware, so it happens before a route's
// rate limiter or validator ever runs. Concurrent requests then cost disk
// and I/O for nothing.
//
// Refusing the content type here, in the server-level stack, means the
// request is answered before the bodyparser reads it. If a real upload
// endpoint is ever added, scope this to everything except that route.
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
