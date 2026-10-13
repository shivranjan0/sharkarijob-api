import User from '#models/user';
export default class AuthController {
    async login({ request, response }) {
        const { email, password } = request.only(['email', 'password']);
        try {
            const user = await User.verifyCredentials(email, password);
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
        const data = request.only(['name', 'email', 'password']);
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
    async me({ auth, response }) {
        const user = auth.user;
        return response.ok({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
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