import env from '#start/env';
import User from '#models/user';
import TwoFactorService from '#services/two_factor_service';
import { randomBytes } from 'node:crypto';
export default class GoogleAuthController {
    get frontend() {
        return env.get('SITE_URL', 'https://sharkarijob.online').replace(/\/$/, '');
    }
    async redirect({ ally, response }) {
        if (!env.get('GOOGLE_CLIENT_ID')) {
            return response.notImplemented({ message: 'Google sign-in is not configured.' });
        }
        return ally.use('google').redirect();
    }
    async callback({ ally, response }) {
        const google = ally.use('google');
        const back = (params) => response.redirect(`${this.frontend}/login#${new URLSearchParams(params)}`);
        if (google.accessDenied())
            return back({ error: 'You cancelled Google sign-in.' });
        if (google.stateMisMatch())
            return back({ error: 'Sign-in expired. Please try again.' });
        if (google.hasError())
            return back({ error: google.getError() || 'Google sign-in failed.' });
        const profile = await google.user();
        const email = profile.email?.trim().toLowerCase();
        if (!email) {
            return back({ error: 'Google did not share an email address.' });
        }
        if (profile.emailVerificationState !== 'verified') {
            return back({ error: 'Your Google email is not verified.' });
        }
        let user = await User.findBy('email', email);
        if (!user) {
            user = await User.create({
                name: profile.name || email.split('@')[0],
                email,
                password: randomBytes(32).toString('hex'),
                avatar: profile.avatarUrl ?? null,
                isAdmin: false,
            });
        }
        else if (!user.avatar && profile.avatarUrl) {
            user.avatar = profile.avatarUrl;
            await user.save();
        }
        if (user.twoFactorEnabled) {
            return back({ challenge: TwoFactorService.issueChallenge(user), twoFactor: '1' });
        }
        const token = await User.accessTokens.create(user);
        return back({
            token: token.value.release(),
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin ? '1' : '0',
        });
    }
}
//# sourceMappingURL=google_auth_controller.js.map