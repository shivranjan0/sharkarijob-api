import app from '@adonisjs/core/services/app';
import env from '#start/env';
import { defineConfig } from '@adonisjs/cors';
const allowedOrigins = env
    .get('CORS_ORIGINS', '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
const corsConfig = defineConfig({
    enabled: true,
    // If CORS_ORIGINS is explicitly set, always honor it -- even if NODE_ENV
    // somehow ends up as "development" on a deployed box (wrong .env copied
    // in, deploy script misconfigured). Only fall back to the wide-open dev
    // default when no origins have been configured at all, which is what
    // local frontend development needs.
    origin: allowedOrigins.length > 0 ? allowedOrigins : app.inDev,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
    headers: true,
    exposeHeaders: [],
    credentials: true,
    maxAge: 90,
});
export default corsConfig;
//# sourceMappingURL=cors.js.map