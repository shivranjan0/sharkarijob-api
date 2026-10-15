import env from '#start/env';
import app from '@adonisjs/core/services/app';
import { isIP } from 'node:net';
import { defineConfig } from '@adonisjs/core/http';
export const appUrl = env.get('APP_URL');
// Which proxies in front of this process may be believed about who the
// caller is. Adonis defaults to "loopback", which is correct when a reverse
// proxy on the same box (nginx/Apache/a panel's Node app manager) forwards
// to 127.0.0.1 -- the X-Forwarded-For it sets is then honoured.
//
// It is NOT correct when traffic arrives straight from a remote CDN or load
// balancer: in that case every request looks like it comes from the CDN's
// edge address, so anything keyed on request.ip() (the rate limiter, logs)
// treats the whole internet as one client.
const trustProxySetting = env.get('TRUST_PROXY', 'loopback');
const trustProxy = trustProxySetting === 'true'
    ? true
    : trustProxySetting === 'false'
        ? false
        : trustProxySetting;
// A CDN-set header naming the real client, e.g. "cf-connecting-ip" behind
// Cloudflare. Left unset the header is ignored entirely.
//
// SECURITY: only set this when the origin refuses connections that did not
// come through that CDN (firewall to the CDN's published ranges, or
// Cloudflare Tunnel / authenticated origin pulls). Any caller able to reach
// this process directly can otherwise forge the header and hand itself a
// fresh rate-limit bucket on every request.
const clientIpHeader = env.get('CLIENT_IP_HEADER', '').trim().toLowerCase();
const getIp = clientIpHeader
    ? (request, originalFn) => {
        const forwarded = request.header(clientIpHeader);
        // Only ever accept a single, well-formed address. A header holding a
        // list, a hostname or junk means the assumption above is wrong, so
        // fall back rather than key anything on an attacker's string.
        if (typeof forwarded === 'string' && isIP(forwarded.trim())) {
            return forwarded.trim();
        }
        return originalFn();
    }
    : undefined;
export const http = defineConfig({
    generateRequestId: true,
    allowMethodSpoofing: false,
    useAsyncLocalStorage: false,
    trustProxy,
    ...(getIp ? { getIp } : {}),
    router: {
        matcher: 'tree',
    },
    redirect: {
        forwardQueryString: true,
    },
    cookie: {
        domain: '',
        path: '/',
        maxAge: '2h',
        httpOnly: true,
        secure: app.inProduction,
        sameSite: 'lax',
    },
});
