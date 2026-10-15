import { Env } from '@adonisjs/core/env';
export default await Env.create(new URL('../', import.meta.url), {
    NODE_ENV: Env.schema.enum(['development', 'production', 'test']),
    PORT: Env.schema.number(),
    HOST: Env.schema.string({ format: 'host' }),
    LOG_LEVEL: Env.schema.string(),
    APP_KEY: Env.schema.secret(),
    APP_URL: Env.schema.string({ format: 'url', tld: false }),
    SITE_URL: Env.schema.string({ format: 'url', tld: false }),
    SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database']),
    DB_HOST: Env.schema.string({ format: 'host' }),
    DB_PORT: Env.schema.number(),
    DB_USER: Env.schema.string(),
    DB_PASSWORD: Env.schema.string.optional(),
    DB_DATABASE: Env.schema.string(),
    DB_SSL_CA: Env.schema.string.optional(),
    DB_SSL: Env.schema.string.optional(),
    CORS_ORIGINS: Env.schema.string.optional(),
    TRUST_PROXY: Env.schema.string.optional(),
    CLIENT_IP_HEADER: Env.schema.string.optional(),
    GOOGLE_CLIENT_ID: Env.schema.string.optional(),
    GOOGLE_CLIENT_SECRET: Env.schema.string.optional(),
    GOOGLE_CALLBACK_URL: Env.schema.string.optional()
});
//# sourceMappingURL=env.js.map