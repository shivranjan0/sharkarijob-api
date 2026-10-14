import User from '#models/user';
import TwoFactorService from '#services/two_factor_service';
import { registerValidator, loginValidator } from '#validators/auth';
export default class AuthController {
    async login({ request, response }) {
        const { email, password } = await request.validateUsing(loginValidator);
        try {
            const user = await User.verifyCredentials(email, password);
            if (user.twoFactorEnabled) {
                return response.ok({
                    requiresTwoFactor: true,
                    challenge: TwoFactorService.issueChallenge(user),
                    message: 'Enter the code from your authenticator app',
                });
            }
            const token = await User.accessTokens.create(user);
            return response.ok({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin
                }
            });
        }
        catch (error) {
            return response.unauthorized({ message: 'Invalid credentials' });
        }
    }
    async register({ request, response }) {
        const data = await request.validateUsing(registerValidator);
        const existingUser = await User.findBy('email', data.email);
        if (existingUser) {
            return response.badRequest({ message: 'Email already in use' });
        }
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
            isAdmin: false
        });
        const token = await User.accessTokens.create(user);
        return response.created({
            message: 'Registration successful',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    async loginTwoFactor({ request, response }) {
        const { challenge, code } = request.only(['challenge', 'code']);
        const userId = challenge ? TwoFactorService.readChallenge(String(challenge)) : null;
        if (!userId) {
            return response.unauthorized({ message: 'This sign-in attempt expired. Start again.' });
        }
        const user = await User.find(userId);
        if (!user || !user.twoFactorEnabled) {
            return response.unauthorized({ message: 'This sign-in attempt is no longer valid.' });
        }
        const supplied = String(code ?? '').trim();
        const ok = (await TwoFactorService.verifyToken(user, supplied)) ||
            (await TwoFactorService.consumeRecoveryCode(user, supplied));
        if (!ok) {
            return response.unauthorized({ message: 'That code is not valid.' });
        }
        const token = await User.accessTokens.create(user);
        return response.ok({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            },
            recoveryCodesRemaining: TwoFactorService.remainingRecoveryCodes(user),
        });
    }
    async me({ auth, response }) {
        const user = auth.user;
        return response.ok({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            twoFactorEnabled: user.twoFactorEnabled
        });
    }
    async logout({ auth, response }) {
        const user = auth.user;
        const current = user.currentAccessToken;
        if (current) {
            await User.accessTokens.delete(user, current.identifier);
        }
        return response.ok({ message: 'Logged out successfully' });
    }
}
//# sourceMappingURL=auth_controller.js.map