import env from '#start/env';
import Post from '#models/post';
import Page from '#models/page';
import Blog from '#models/blog';
function xmlEscape(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
const CATEGORY_ROUTES = {
    'Latest Jobs': '/jobs',
    'Results': '/results',
    'Admit Card': '/admit-cards',
    'Answer Key': '/answer-keys',
    'Admission': '/admissions',
    'Syllabus': '/syllabus',
};
export default class SeoController {
    get site() {
        return env.get('SITE_URL').replace(/\/$/, '');
    }
    async sitemap({ response }) {
        const site = this.site;
        const [posts, pages, blogs] = await Promise.all([
            Post.query().where('status', 'published').select('slug', 'updatedAt').orderBy('updatedAt', 'desc'),
            Page.query().select('slug', 'updatedAt'),
            Blog.query().where('status', 'published').select('slug', 'updatedAt'),
        ]);
        const entries = [
            { loc: '/', priority: '1.0' },
            { loc: '/about', priority: '0.5' },
            { loc: '/contact', priority: '0.5' },
            { loc: '/blog', priority: '0.7' },
            ...Object.values(CATEGORY_ROUTES).map((loc) => ({ loc, priority: '0.9' })),
            ...posts.map((p) => ({ loc: `/post/${p.slug}`, lastmod: p.updatedAt, priority: '0.8' })),
            ...blogs.map((b) => ({ loc: `/blog/${b.slug}`, lastmod: b.updatedAt, priority: '0.6' })),
            ...pages.map((p) => ({ loc: `/${p.slug}`, lastmod: p.updatedAt, priority: '0.3' })),
        ];
        const body = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
            entries
                .map((e) => {
                const lastmod = e.lastmod ? `\n    <lastmod>${e.lastmod.toISODate()}</lastmod>` : '';
                return `  <url>\n    <loc>${xmlEscape(site + e.loc)}</loc>${lastmod}\n    <priority>${e.priority}</priority>\n  </url>`;
            })
                .join('\n') +
            '\n</urlset>\n';
        return response.header('Content-Type', 'application/xml; charset=utf-8').send(body);
    }
    async feed({ response }) {
        const site = this.site;
        const posts = await Post.query()
            .where('status', 'published')
            .orderBy('createdAt', 'desc')
            .limit(50);
        const items = posts
            .map((p) => {
            const link = `${site}/post/${p.slug}`;
            const pubDate = p.createdAt ? p.createdAt.toRFC2822() : '';
            const description = p.shortDescription ?? p.metaDescription ?? '';
            return ('    <item>\n' +
                `      <title>${xmlEscape(p.title)}</title>\n` +
                `      <link>${xmlEscape(link)}</link>\n` +
                `      <guid isPermaLink="true">${xmlEscape(link)}</guid>\n` +
                (pubDate ? `      <pubDate>${pubDate}</pubDate>\n` : '') +
                `      <description>${xmlEscape(description)}</description>\n` +
                '    </item>');
        })
            .join('\n');
        const body = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<rss version="2.0">\n  <channel>\n' +
            '    <title>Sharkari Job — Latest Government Jobs</title>\n' +
            `    <link>${xmlEscape(site)}</link>\n` +
            '    <description>Latest government job notifications, admit cards, results, answer keys and syllabi.</description>\n' +
            '    <language>en-in</language>\n' +
            items +
            '\n  </channel>\n</rss>\n';
        return response.header('Content-Type', 'application/rss+xml; charset=utf-8').send(body);
    }
}
//# sourceMappingURL=seo_controller.js.map