import env from '#start/env';
import { defineConfig, transports } from '@adonisjs/mail';
const mailConfig = defineConfig({
    default: 'smtp',
    from: {
        address: env.get('MAIL_FROM_ADDRESS', 'no-reply@sharkarijob.online'),
        name: env.get('MAIL_FROM_NAME', 'Sharkari Job'),
    },
    mailers: {
        smtp: transports.smtp({
            host: env.get('SMTP_HOST', ''),
            port: Number(env.get('SMTP_PORT', 587)),
            secure: Number(env.get('SMTP_PORT', 587)) === 465,
            auth: {
                type: 'login',
                user: env.get('SMTP_USERNAME', ''),
                pass: env.get('SMTP_PASSWORD', ''),
            },
            connectionTimeout: 10_000,
            greetingTimeout: 10_000,
            socketTimeout: 20_000,
        }),
    },
});
export default mailConfig;
//# sourceMappingURL=mail.js.map