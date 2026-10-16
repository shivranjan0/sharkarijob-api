import mail from '@adonisjs/mail/services/main';
import env from '#start/env';
import logger from '@adonisjs/core/services/logger';
export default class Mailer {
    static get enabled() {
        return Boolean(env.get('SMTP_HOST') && env.get('SMTP_USERNAME'));
    }
    static get adminAddress() {
        return env.get('ADMIN_NOTIFY_EMAIL') || env.get('MAIL_FROM_ADDRESS');
    }
    static escape(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
    static async trySend(description, build) {
        if (!this.enabled) {
            logger.debug(`[mail] skipped (${description}) -- SMTP not configured`);
            return false;
        }
        try {
            await mail.send(build);
            return true;
        }
        catch (error) {
            logger.error({ err: error }, `[mail] failed to send: ${description}`);
            return false;
        }
    }
    static async notifyContactMessage(msg) {
        const to = this.adminAddress;
        if (!to)
            return false;
        const subject = msg.subject?.trim() || 'No subject';
        return this.trySend(`contact message #${msg.id}`, (message) => {
            message
                .to(to)
                .replyTo(msg.email, msg.name)
                .subject(`Contact form: ${subject}`)
                .html([
                `<p><strong>${this.escape(msg.name)}</strong> &lt;${this.escape(msg.email)}&gt; wrote:</p>`,
                `<p><em>${this.escape(subject)}</em></p>`,
                `<hr>`,
                `<p style="white-space:pre-wrap">${this.escape(msg.message)}</p>`,
                `<hr>`,
                `<p style="color:#64748b;font-size:13px">Message #${msg.id} &middot; reply to this email to answer directly.</p>`,
            ].join('\n'));
        });
    }
    static async acknowledgeContactMessage(msg) {
        return this.trySend(`contact acknowledgement to ${msg.email}`, (message) => {
            message
                .to(msg.email, msg.name)
                .subject('We received your message - Sharkari Job')
                .html([
                `<p>Hi ${this.escape(msg.name)},</p>`,
                `<p>Thanks for writing to Sharkari Job. Your message has reached us and we will reply to this address.</p>`,
                `<p style="color:#64748b;font-size:13px">This is an automated confirmation -- there is no need to reply to it.</p>`,
            ].join('\n'));
        });
    }
}
//# sourceMappingURL=mailer.js.map