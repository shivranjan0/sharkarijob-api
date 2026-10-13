import app from '@adonisjs/core/services/app';
import env from '#start/env';
import { defineConfig } from '@adonisjs/cors';
/**
 * In production the browser calls this API from the frontend's origin, so that
 * origin has to be allowed explicitly. List it in CORS_ORIGINS (comma-separated,
 * scheme included, no trailing slash) e.g.
 *
 *   CORS_ORIGINS=https://sharkarijob.online,https://www.sharkarijob.online
 *
 * Leaving it unset in production allows nothing, which blocks every request --
 * the previous behaviour, kept so a missing value fails loudly instead of
 * silently allowing any site to call the API.
 */
const allowedOrigins = env
    .get('CORS_ORIGINS', '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
const corsConfig = defineConfig({
    enabled: true,
    origin: app.inDev ? true : allowedOrigins,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
    headers: true,
    exposeHeaders: [],
    credentials: true,
    maxAge: 90,
});
export default corsConfig;
//# sourceMappingURL=cors.js.map