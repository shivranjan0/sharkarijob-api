import db from '@adonisjs/lucid/services/db';
import { DateTime } from 'luxon';
const STUB_WORDS = 200;
const FULL_ARTICLE_WORDS = 400;
const THIN_WORDS = 120;
const SAME_TEXT = 0.65;
const EXPIRED_AFTER_DAYS = 30;
const CACHE_MS = 10 * 60 * 1000;
const NOISE = /\b(online|form|recruitment|apply|vacancy|vacancies|notification|bharti|last|date|today|start|extend|extended|available|soon|now|link|active|posts?|\d+|january|february|march|april|may|june|july|august|september|october|november|december|[0-9a-f]{10,}|updated)\b/g;
function slugKey(slug, categoryId) {
    const base = slug.replace(/-[0-9a-f]{10,}$/, '').replace(/-last-date-.*$/, '');
    const years = new Set(base.match(/(?<!\d)20\d{2}(?!\d)/g) ?? []);
    for (const m of base.matchAll(/(?<!\d)0?\d(20\d{2})(?!\d)/g))
        years.add(m[1]);
    const core = base
        .replace(/(?<!\d)20\d{2}(?!\d)/g, ' ')
        .replace(/-/g, ' ')
        .replace(NOISE, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .join(' ');
    if (core.length < 8)
        return null;
    return `${core}|${[...years].sort().join(',')}|${categoryId ?? ''}`;
}
function wordSet(text) {
    const tokens = text
        .replace(/<[^>]+>/g, ' ')
        .replace(/&[a-z]+;/gi, ' ')
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
    return { words: tokens.length, set: new Set(tokens) };
}
function jaccard(a, b) {
    if (a.size === 0 || b.size === 0)
        return 0;
    let shared = 0;
    const [small, large] = a.size < b.size ? [a, b] : [b, a];
    for (const w of small)
        if (large.has(w))
            shared++;
    return shared / (a.size + b.size - shared);
}
let cache = null;
let pending = null;
async function build() {
    const rows = (await db
        .from('posts')
        .leftJoin('categories', 'posts.category_id', 'categories.id')
        .where('posts.status', 'published')
        .select('posts.id', 'posts.slug', 'posts.category_id', 'categories.name as category_name', 'posts.application_end_date', 'posts.content'));
    const info = rows.map((r) => ({ row: r, ...wordSet(r.content ?? '') }));
    const groups = new Map();
    for (const i of info) {
        const key = slugKey(i.row.slug, i.row.category_id);
        if (!key)
            continue;
        const list = groups.get(key) ?? [];
        list.push(i);
        groups.set(key, list);
    }
    const result = new Map();
    const get = (slug) => {
        let q = result.get(slug);
        if (!q) {
            q = { canonicalSlug: null, redirectTo: null, noindex: false };
            result.set(slug, q);
        }
        return q;
    };
    for (const list of groups.values()) {
        if (list.length < 2)
            continue;
        list.sort((a, b) => b.words - a.words || a.row.id - b.row.id);
        const primary = list[0];
        for (const copy of list.slice(1)) {
            const q = get(copy.row.slug);
            if (copy.words < STUB_WORDS && primary.words >= FULL_ARTICLE_WORDS) {
                q.redirectTo = primary.row.slug;
                q.canonicalSlug = primary.row.slug;
            }
            else if (jaccard(copy.set, primary.set) >= SAME_TEXT) {
                q.canonicalSlug = primary.row.slug;
            }
        }
    }
    const cutoff = DateTime.now().minus({ days: EXPIRED_AFTER_DAYS }).startOf('day');
    for (const i of info) {
        const q = get(i.row.slug);
        const end = i.row.application_end_date
            ? DateTime.fromJSDate(new Date(i.row.application_end_date))
            : null;
        const expiredJob = i.row.category_name === 'Latest Jobs' && end?.isValid && end < cutoff;
        const thin = i.words < THIN_WORDS;
        if (expiredJob || thin)
            q.noindex = true;
    }
    return result;
}
export async function getPostQuality() {
    if (cache && Date.now() - cache.at < CACHE_MS)
        return cache.map;
    if (!pending) {
        pending = build()
            .then((map) => {
            cache = { at: Date.now(), map };
            return map;
        })
            .finally(() => {
            pending = null;
        });
    }
    return pending;
}
export function skipInSitemap(q) {
    return !!q && (q.noindex || !!q.canonicalSlug || !!q.redirectTo);
}
//# sourceMappingURL=post_quality.js.map