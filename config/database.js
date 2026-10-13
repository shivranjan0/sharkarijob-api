import env from '#start/env';
import app from '@adonisjs/core/services/app';
import { defineConfig } from '@adonisjs/lucid';
/**
 * TLS to the database.
 *
 * mysql2 does NOT encrypt unless it is told to, and a managed provider will
 * happily accept a plaintext connection -- Aiven's `ssl-mode=REQUIRED` is part
 * of the URI it shows you, not something the server enforces. An unencrypted
 * hop across the public internet exposes the password and every row, so TLS is
 * on by default for any host that is not loopback.
 *
 *   DB_SSL_CA  the provider's CA certificate (PEM). With it the server identity
 *              is verified; without it the link is encrypted but unverified.
 *   DB_SSL     'false' forces TLS off, 'true' forces it on. Unset = automatic:
 *              on for a remote host, off for 127.0.0.1.
 *
 * Hosts that only allow single-line env vars can supply the PEM with literal
 * backslash-n in place of real newlines; both forms are accepted.
 */
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