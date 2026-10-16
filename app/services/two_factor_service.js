import encryption from '@adonisjs/core/services/encryption';
import hash from '@adonisjs/core/services/hash';
import { randomBytes } from 'node:crypto';
import { generateSecret, generate, verify, generateURI } from 'otplib';
const ISSUER = 'Sharkari Job';
const RECOVERY_CODE_COUNT = 8;
export default class TwoFactorService {
    static async beginSetup(user) {
        const secret = await generateSecret();
        const otpauthUrl = await generateURI({ secret, label: user.email, issuer: ISSUER });
        user.twoFactorSecret = encryption.encrypt(secret);
        user.twoFactorConfirmedAt = null;
        await user.save();
        return { secret, otpauthUrl };
    }
    static secretFor(user) {
        if (!user.twoFactorSecret)
            return null;
        try {
            return encryption.decrypt(user.twoFactorSecret);
        }
        catch {
            return null;
        }
    }
    static async verifyToken(user, token) {
        const secret = this.secretFor(user);
        if (!secret)
            return false;
        const cleaned = token.replace(/\s+/g, '');
        if (!/^\d{6}$/.test(cleaned))
            return false;
        const result = await verify({ token: cleaned, secret });
        return Boolean(result?.valid);
    }
    static async confirm(user, token) {
        if (!(await this.verifyToken(user, token)))
            return null;
        const codes = Array.from({ length: RECOVERY_CODE_COUNT }, () => randomBytes(5).toString('hex').toUpperCase().match(/.{1,5}/g).join('-'));
        const hashed = await Promise.all(codes.map((code) => hash.make(code)));
        user.twoFactorRecoveryCodes = encryption.encrypt(JSON.stringify(hashed));
        user.twoFactorConfirmedAt = (await import('luxon')).DateTime.now();
        await user.save();
        return codes;
    }
    static async consumeRecoveryCode(user, code) {
        if (!user.twoFactorRecoveryCodes)
            return false;
        let hashes;
        try {
            hashes = JSON.parse(encryption.decrypt(user.twoFactorRecoveryCodes) ?? '[]');
        }
        catch {
            return false;
        }
        const candidate = code.trim().toUpperCase();
        for (let i = 0; i < hashes.length; i++) {
            if (await hash.verify(hashes[i], candidate)) {
                hashes.splice(i, 1);
                user.twoFactorRecoveryCodes = encryption.encrypt(JSON.stringify(hashes));
                await user.save();
                return true;
            }
        }
        return false;
    }
    static remainingRecoveryCodes(user) {
        if (!user.twoFactorRecoveryCodes)
            return 0;
        try {
            return JSON.parse(encryption.decrypt(user.twoFactorRecoveryCodes) ?? '[]').length;
        }
        catch {
            return 0;
        }
    }
    static async disable(user) {
        user.twoFactorSecret = null;
        user.twoFactorConfirmedAt = null;
        user.twoFactorRecoveryCodes = null;
        await user.save();
    }
    static issueChallenge(user) {
        return encryption.encrypt({ uid: user.id, stage: '2fa' }, '10 mins');
    }
    static readChallenge(challenge) {
        try {
            const payload = encryption.decrypt(challenge);
            if (!payload || payload.stage !== '2fa')
                return null;
            return payload.uid;
        }
        catch {
            return null;
        }
    }
    static async currentToken(user) {
        const secret = this.secretFor(user);
        return secret ? generate({ secret }) : null;
    }
}
//# sourceMappingURL=two_factor_service.js.map