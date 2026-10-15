import TwoFactorService from '#services/two_factor_service';
export default class TwoFactorController {
    async status({ auth, response }) {
        const user = auth.user;
        return response.ok({
            enabled: user.twoFactorEnabled,
            pending: Boolean(user.twoFactorSecret) && !user.twoFactorConfirmedAt,
            recoveryCodesRemaining: TwoFactorService.remainingRecoveryCodes(user),
        });
    }
    async setup({ auth, response }) {
        const user = auth.user;
        if (user.twoFactorEnabled) {
            return response.conflict({
                message: 'Two-factor authentication is already enabled. Disable it first.',
            });
        }
        const { secret, otpauthUrl } = await TwoFactorService.beginSetup(user);
        return response.ok({
            secret,
            otpauthUrl,
            message: 'Scan the QR code, then confirm with a code from your app',
        });
    }
    async confirm({ auth, request, response }) {
        const user = auth.user;
        const code = String(request.input('code', '')).trim();
        if (!user.twoFactorSecret) {
            return response.badRequest({ message: 'Start setup first.' });
        }
        if (user.twoFactorConfirmedAt) {
            return response.conflict({ message: 'Two-factor authentication is already enabled.' });
        }
        const recoveryCodes = await TwoFactorService.confirm(user, code);
        if (!recoveryCodes) {
            return response.unprocessableEntity({ message: 'That code is not valid. Try again.' });
        }
        // Any token minted before 2FA existed must not keep bypassing it.
        await user.revokeOtherAccessTokens();
        return response.ok({
            message: 'Two-factor authentication enabled. Your other sessions have been signed out.',
            recoveryCodes,
            warning: 'Save these now. They are shown once and each works a single time.',
        });
    }
    async disable({ auth, request, response }) {
        const user = auth.user;
        const code = String(request.input('code', '')).trim();
        if (!user.twoFactorEnabled) {
            return response.badRequest({ message: 'Two-factor authentication is not enabled.' });
        }
        const ok = (await TwoFactorService.verifyToken(user, code)) ||
            (await TwoFactorService.consumeRecoveryCode(user, code));
        if (!ok) {
            return response.unprocessableEntity({ message: 'That code is not valid.' });
        }
        await TwoFactorService.disable(user);
        return response.ok({ message: 'Two-factor authentication disabled' });
    }
}
//# sourceMappingURL=two_factor_controller.js.map