import env from '#start/env';
import app from '@adonisjs/core/services/app';
import { defineConfig } from '@adonisjs/lucid';
const dbHost = env.get('DB_HOST', '127.0.0.1');
const sslCa = env.get('DB_SSL_CA', '');
const isLoopback = ['127.0.0.1', 'localhost', '::1'].includes(dbHost);
const sslOverride = env.get('DB_SSL', '');
const wantSsl = sslOverride ? sslOverride.toLowerCase() !== 'false' : !isLoopback;
const ssl = wantSsl
    ? sslCa
        ? { ca: sslCa.split(String.fromCharCode(92) + 'n').join('\n'), rejectUnauthorized: true }
        : { rejectUnauthorized: false }
    : undefined;
if (wantSsl && !sslCa) {
    console.warn(`[db] TLS on but DB_SSL_CA is unset -- ${dbHost} is encrypted but NOT verified. Set DB_SSL_CA.`);
}
const dbConfig = defineConfig({
    connection: 'mysql',
    connections: {
        mysql: {
            client: 'mysql2',
            connection: {
                host: env.get('DB_HOST', '127.0.0.1'),
                port: env.get('DB_PORT', 3306),
                user: env.get('DB_USER', 'root'),
                password: env.get('DB_PASSWORD', ''),
                database: env.get('DB_DATABASE', 'sharkari'),
                ...(ssl ? { ssl } : {}),
            },
            migrations: {
                naturalSort: true,
                paths: ['database/migrations'],
            },
            debug: app.inDev,
        },
    },
});
export default dbConfig;
//# sourceMappingURL=database.js.map