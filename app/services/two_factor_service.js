import encryption from '@adonisjs/core/services/encryption';
import hash from '@adonisjs/core/services/hash';
import db from '@adonisjs/lucid/services/db';
import { randomBytes } from 'node:crypto';
import { generateSecret, generate, verify, generateURI } from 'otplib';
const ISSUER = 'Sharkari Job';
const RECOVERY_CODE_COUNT = 8;
const TOTP_PERIOD_SECONDS = 30;
// A valid TOTP code stays correct for its whole ~30s step, so otplib will
// happily accept the same code twice in a row. Track the last time-step
// that was actually accepted per user so a captured/replayed code is
// rejected the second time it's submitted. In-memory is enough here: this
// API runs as a single process, and the cost of losing this on a restart is
// just a brief re-opening of a ~30s replay window, not an auth bypass.
const lastAcceptedTimeStep = new Map();
// A completed 2FA login challenge must not be reusable -- otherwise an
// attacker who captures one valid (challenge, code) pair, or who captures
// just the challenge, gets up to its full 10-minute lifetime to keep
// guessing codes even after a legitimate login has already gone through.
const usedChallenges = new Map();
function pruneUsedChallenges() {
    const now = Date.now();
    for (const [key, expiresAt] of usedChallenges) {
        if (expiresAt <= now)
            usedChallenges.delete(key);
    }
}
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
        if (!result?.valid)
            return false;
        const timeStep = Math.floor(result.epoch / TOTP_PERIOD_SECONDS);
        const lastStep = lastAcceptedTimeStep.get(user.id);
        if (lastStep !== undefined && timeStep <= lastStep) {
            // Same code (or an older one) already used -- reject the replay.
            return false;
        }
        lastAcceptedTimeStep.set(user.id, timeStep);
        return true;
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
        const candidate = code.trim().toUpperCase();
        // Lock the row for the whole check-then-write so two requests racing
        // on the same recovery code can't both pass the bcrypt check before
        // either one's removal of the code is saved -- without the lock, a
        // code meant to work exactly once could authenticate twice.
        return db.transaction(async (trx) => {
            const locked = await user.constructor
                .query({ client: trx })
                .where('id', user.id)
                .forUpdate()
                .firstOrFail();
            if (!locked.twoFactorRecoveryCodes)
                return false;
            let hashes;
            try {
                hashes = JSON.parse(encryption.decrypt(locked.twoFactorRecoveryCodes) ?? '[]');
            }
            catch {
                return false;
            }
            for (let i = 0; i < hashes.length; i++) {
                if (await hash.verify(hashes[i], candidate)) {
                    hashes.splice(i, 1);
                    locked.twoFactorRecoveryCodes = encryption.encrypt(JSON.stringify(hashes));
                    await locked.save();
                    user.twoFactorRecoveryCodes = locked.twoFactorRecoveryCodes;
                    return true;
                }
            }
            return false;
        });
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
    static isChallengeUsed(challenge) {
        pruneUsedChallenges();
        return usedChallenges.has(challenge);
    }
    static markChallengeUsed(challenge) {
        pruneUsedChallenges();
        // Matches the challenge's own lifetime -- no point remembering it
        // past the point it would have expired anyway.
        usedChallenges.set(challenge, Date.now() + 10 * 60 * 1000);
    }
    static async currentToken(user) {
        const secret = this.secretFor(user);
        return secret ? generate({ secret }) : null;
    }
}
//# sourceMappingURL=two_factor_service.js.map