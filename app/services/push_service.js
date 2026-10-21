import webpush from 'web-push';
import db from '@adonisjs/lucid/services/db';
import env from '#start/env';
import logger from '@adonisjs/core/services/logger';
const GUEST = 'guest';
const USER = 'App\\Models\\User';
let configured = null;
function ensureConfigured() {
    if (configured !== null)
        return configured;
    const pub = env.get('VAPID_PUBLIC_KEY');
    const priv = env.get('VAPID_PRIVATE_KEY');
    if (!pub || !priv) {
        configured = false;
        return false;
    }
    webpush.setVapidDetails(env.get('VAPID_SUBJECT') || `mailto:${env.get('ADMIN_NOTIFY_EMAIL') || 'admin@sharkarijob.online'}`, pub, priv);
    configured = true;
    return true;
}
export default class PushService {
    static get publicKey() {
        return env.get('VAPID_PUBLIC_KEY') || null;
    }
    static get enabled() {
        return ensureConfigured();
    }
    static async subscribe(sub, userId) {
        const now = new Date();
        const row = {
            subscribable_type: userId ? USER : GUEST,
            subscribable_id: userId ?? 0,
            public_key: sub.keys.p256dh,
            auth_token: sub.keys.auth,
            content_encoding: sub.contentEncoding || 'aesgcm',
            updated_at: now,
        };
        const existing = await db.from('push_subscriptions').where('endpoint', sub.endpoint).first();
        if (existing) {
            await db.from('push_subscriptions').where('id', existing.id).update(row);
        }
        else {
            await db.table('push_subscriptions').insert({ ...row, endpoint: sub.endpoint, created_at: now });
        }
    }
    static async unsubscribe(endpoint) {
        await db.from('push_subscriptions').where('endpoint', endpoint).delete();
    }
    /** Send one payload to every subscriber. Prunes expired endpoints. */
    static async broadcast(payload) {
        if (!ensureConfigured())
            return { sent: 0, failed: 0, removed: 0 };
        const body = JSON.stringify(payload);
        const subs = await db.from('push_subscriptions').select('*');
        let sent = 0, failed = 0;
        const dead = [];
        for (let i = 0; i < subs.length; i += 50) {
            await Promise.all(subs.slice(i, i + 50).map(async (s) => {
                try {
                    await webpush.sendNotification({
                        endpoint: s.endpoint,
                        keys: { p256dh: s.public_key, auth: s.auth_token },
                    }, body, { TTL: 60 * 60 * 24 });
                    sent++;
                }
                catch (err) {
                    failed++;
                    if (err?.statusCode === 404 || err?.statusCode === 410)
                        dead.push(s.id);
                    else
                        logger.warn({ status: err?.statusCode }, 'push send failed');
                }
            }));
        }
        if (dead.length)
            await db.from('push_subscriptions').whereIn('id', dead).delete();
        return { sent, failed, removed: dead.length };
    }
    /** Announce a newly published post. Never throws. */
    static async notifyPost(post) {
        try {
            if (!ensureConfigured())
                return;
            const site = (env.get('SITE_URL') || '').replace(/\/$/, '');
            await PushService.broadcast({
                title: post.title,
                body: post.shortDescription || 'New update on Sharkari Job - tap to read.',
                icon: `${site}/icon-192.png`,
                data: { url: `${site}/post/${post.slug}` },
            });
        }
        catch (err) {
            logger.error({ err }, 'notifyPost failed');
        }
    }
}
