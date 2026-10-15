// DEAD CODE -- kept only because something may still import it.
//
// This used to be a second, unrouted login endpoint: it called
// User.verifyCredentials() and immediately minted an access token, with no
// check on user.twoFactorEnabled. AuthController.login does check, and
// AdminMiddleware refuses any admin who has not enrolled in 2FA -- so wiring
// this controller to a route would have handed out admin-capable tokens that
// skipped the second factor entirely.
//
// It is not routed in start/routes.js. Rather than leave a working 2FA
// bypass sitting one `router.post(...)` away, it now refuses outright.
// Delete this file; the real endpoints are POST /api/v1/login and
// POST /api/v1/login/2fa.
export default class AccessTokensController {
    async store({ response }) {
        return response.gone({
            message: 'This endpoint has been removed. Use POST /api/v1/login.',
        });
    }
    async destroy({ response }) {
        return response.gone({
            message: 'This endpoint has been removed. Use POST /api/v1/logout.',
        });
    }
}
