import env from '#start/env';
import { defineConfig, services } from '@adonisjs/ally';
const allyConfig = defineConfig({
    google: services.google({
        clientId: env.get('GOOGLE_CLIENT_ID', ''),
        clientSecret: env.get('GOOGLE_CLIENT_SECRET', ''),
        callbackUrl: env.get('GOOGLE_CALLBACK_URL', 'https://api.sharkarijob.online/api/v1/auth/google/callback'),
    }),
});
export default allyConfig;
//# sourceMappingURL=ally.js.map