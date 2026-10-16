import { DateTime } from 'luxon';
import Post from '#models/post';
import Category from '#models/category';
import Blog from '#models/blog';
import BlogCategory from '#models/blog_category';
import Page from '#models/page';
import ContactMessage from '#models/contact_message';
import env from '#start/env';
import { renderSections, normaliseHtml, plainText } from './content_format.js';
import { slugify, buildMetaTitle, buildMetaDescription, buildKeywords, buildSchema, } from './seo_fields.js';
const SECTION_SCHEMA = {
    type: 'array',
    description: 'The body, as the blocks this site is built from. Strongly preferred over contentHtml: ' +
        'it is rendered into exactly the markup the existing posts use, so a new post looks ' +
        'identical to the rest of the site. Text fields accept **bold** and [label](https://url) ' +
        'and nothing else.',
    items: {
        type: 'object',
        required: ['kind'],
        properties: {
            kind: {
                type: 'string',
                enum: ['heading', 'paragraph', 'card', 'table', 'grid', 'list', 'links', 'faq'],
                description: 'heading = <h2>. paragraph = plain prose. card = a titled box, the usual container ' +
                    'for a block of explanation. table = two-column label/value, for Important Dates ' +
                    'and Application Fee. grid = a table with its own column headings, for vacancy ' +
                    'breakdowns. list = bullets. links = the Important Links table a job post ends ' +
                    'with. faq = question and answer pairs.',
            },
            text: { type: 'string', description: 'For heading and paragraph.' },
            heading: { type: 'string', description: 'The block title. Required for card, table and grid.' },
            body: { type: 'string', description: 'For card.' },
            ordered: { type: 'boolean', description: 'For list: numbered instead of bulleted.' },
            items: {
                type: 'array',
                description: 'For list: strings. For faq: objects with question and answer.',
                items: {},
            },
            columns: { type: 'array', items: { type: 'string' }, description: 'For grid.' },
            rows: {
                type: 'array',
                description: 'For table: objects with label and value. For grid: arrays of cell strings, one per column.',
                items: {},
            },
            links: {
                type: 'array',
                description: 'For links: objects with label and url. Non-http URLs are dropped.',
                items: {
                    type: 'object',
                    required: ['label', 'url'],
                    properties: { label: { type: 'string' }, url: { type: 'string' } },
                },
            },
        },
    },
};
const CONTENT_HTML_SCHEMA = {
    type: 'string',
    description: 'Raw HTML, for migrating content that already exists. Scripts, styles, event handlers ' +
        'and pasted layout classes are stripped on the way in. Use sections instead when writing ' +
        'something new.',
};
function buildBody(args) {
    if (Array.isArray(args.sections) && args.sections.length) {
        return { html: renderSections(args.sections), notes: ['body rendered from sections'] };
    }
    if (typeof args.contentHtml === 'string' && args.contentHtml.trim()) {
        const cleaned = normaliseHtml(args.contentHtml);
        return { html: cleaned.html, notes: cleaned.notes };
    }
    return { html: undefined, notes: [] };
}
async function uniqueSlug(model, base, ignoreId) {
    let candidate = base;
    let suffix = 1;
    while (true) {
        const query = model.query().where('slug', candidate);
        if (ignoreId)
            query.whereNot('id', ignoreId);
        if (!(await query.first()))
            return candidate;
        suffix++;
        candidate = `${base}-${suffix}`;
    }
}
function toDate(value, field) {
    if (value === undefined)
        return undefined;
    if (value === null || value === '')
        return null;
    const parsed = DateTime.fromISO(String(value));
    if (!parsed.isValid) {
        throw new Error(`${field} must be a date in YYYY-MM-DD form, received "${value}"`);
    }
    return parsed;
}
function postSummary(post) {
    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
        category: post.category?.name ?? null,
        organization: post.organization,
        isLive: post.isLive,
        isFeatured: post.isFeatured,
        isTrending: post.isTrending,
        views: post.views,
        applicationEndDate: post.applicationEndDate?.toISODate?.() ?? null,
        createdAt: post.createdAt?.toISO?.() ?? null,
        url: `${env.get('SITE_URL')}/post/${post.slug}`,
    };
}
function writeResult(post, notes) {
    return {
        ok: true,
        id: post.id,
        slug: post.slug,
        status: post.status,
        url: `${env.get('SITE_URL')}/post/${post.slug}`,
        seo: {
            metaTitle: post.metaTitle,
            metaDescription: post.metaDescription,
            metaKeywords: post.metaKeywords,
            structuredData: post.schemaJson ? 'JobPosting' : null,
        },
        wordCount: plainText(post.content ?? '').split(/\s+/).filter(Boolean).length,
        notes,
    };
}
const POST_WRITE_FIELDS = {
    title: { type: 'string', description: 'Headline. Also the basis of the slug and meta title.' },
    categoryId: {
        type: 'integer',
        description: 'Required on create. Call list_categories for the ids.',
    },
    slug: {
        type: 'string',
        description: 'URL segment. Derived from the title when omitted. On update, only pass this when the ' +
            'URL is meant to change -- doing so breaks existing inbound links.',
    },
    shortDescription: {
        type: 'string',
        description: 'One or two sentences. Shown on cards and used as the meta description.',
    },
    sections: SECTION_SCHEMA,
    contentHtml: CONTENT_HTML_SCHEMA,
    status: { type: 'string', enum: ['draft', 'published'], description: 'Defaults to draft.' },
    organization: { type: 'string', description: 'The recruiting body, e.g. "Staff Selection Commission (SSC)".' },
    location: { type: 'string' },
    totalPosts: { type: 'integer', description: 'Number of vacancies.' },
    applicationStartDate: { type: 'string', description: 'YYYY-MM-DD.' },
    applicationEndDate: { type: 'string', description: 'YYYY-MM-DD.' },
    examDate: { type: 'string', description: 'YYYY-MM-DD.' },
    applyOnlineUrl: { type: 'string' },
    officialNotificationUrl: { type: 'string' },
    officialWebsiteUrl: { type: 'string' },
    thumbnail: { type: 'string', description: 'Absolute image URL.' },
    banner: { type: 'string', description: 'Absolute image URL.' },
    isFeatured: { type: 'boolean' },
    isTrending: { type: 'boolean' },
    isLive: { type: 'boolean' },
    metaTitle: { type: 'string', description: 'Optional. Generated from the title when omitted.' },
    metaDescription: {
        type: 'string',
        description: 'Optional. Generated from shortDescription, or the body, when omitted.',
    },
    metaKeywords: {
        type: 'string',
        description: 'Optional, comma separated. Generated from the title, organisation, category and ' +
            'location when omitted. Filler words and anything that is not a word are dropped.',
    },
};
function postPayload(args) {
    const payload = {};
    for (const key of [
        'title', 'categoryId', 'shortDescription', 'status', 'organization', 'location',
        'totalPosts', 'applyOnlineUrl', 'officialNotificationUrl', 'officialWebsiteUrl',
        'thumbnail', 'banner', 'isFeatured', 'isTrending', 'isLive',
    ]) {
        if (args[key] !== undefined)
            payload[key] = args[key];
    }
    for (const key of ['applicationStartDate', 'applicationEndDate', 'examDate']) {
        const value = toDate(args[key], key);
        if (value !== undefined)
            payload[key] = value;
    }
    return payload;
}
export const TOOLS = [
    {
        name: 'list_categories',
        title: 'List post categories',
        description: 'The categories a post can belong to (Latest Jobs, Results, Admit Card, Answer Key, ' +
            'Admission, Syllabus) with their ids. Call this before creating a post.',
        inputSchema: { type: 'object', properties: {} },
        async handler() {
            const rows = await Category.query().orderBy('order', 'asc');
            return rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
        },
    },
    {
        name: 'get_dashboard',
        title: 'Site overview',
        description: 'Counts of posts, blogs, pages and unread contact messages.',
        inputSchema: { type: 'object', properties: {} },
        async handler() {
            const [posts, published, drafts, blogs, pages, messages] = await Promise.all([
                Post.query().count('* as total'),
                Post.query().where('status', 'published').count('* as total'),
                Post.query().where('status', 'draft').count('* as total'),
                Blog.query().count('* as total'),
                Page.query().count('* as total'),
                ContactMessage.query().count('* as total'),
            ]);
            const n = (rows) => Number(rows[0].$extras.total);
            return {
                posts: n(posts),
                published: n(published),
                drafts: n(drafts),
                blogs: n(blogs),
                pages: n(pages),
                contactMessages: n(messages),
            };
        },
    },
    {
        name: 'list_posts',
        title: 'List posts',
        description: 'Search and page through posts, drafts included. Returns summaries without the body; ' +
            'use get_post for one post in full.',
        inputSchema: {
            type: 'object',
            properties: {
                search: { type: 'string', description: 'Matches the title and slug.' },
                category: { type: 'string', description: 'Category name, e.g. "Latest Jobs".' },
                status: { type: 'string', enum: ['draft', 'published'] },
                sort: {
                    type: 'string',
                    enum: ['latest', 'oldest', 'popular', 'title'],
                    description: 'Defaults to latest.',
                },
                page: { type: 'integer', minimum: 1 },
                limit: { type: 'integer', minimum: 1, maximum: 100, description: 'Defaults to 20.' },
            },
        },
        async handler(args) {
            const query = Post.query().preload('category');
            if (args.search) {
                const like = `%${args.search}%`;
                query.where((b) => b.where('title', 'like', like).orWhere('slug', 'like', like));
            }
            if (args.category) {
                query.whereHas('category', (c) => c.where('name', String(args.category)));
            }
            if (args.status)
                query.where('status', String(args.status));
            const ORDER = Object.assign(Object.create(null), {
                latest: ['createdAt', 'desc'],
                oldest: ['createdAt', 'asc'],
                popular: ['views', 'desc'],
                title: ['title', 'asc'],
            });
            const [column, direction] = ORDER[String(args.sort ?? '').toLowerCase()] ?? ORDER.latest;
            const result = await query
                .orderBy(column, direction)
                .orderBy('id', 'desc')
                .paginate(Number(args.page ?? 1), Math.min(Number(args.limit ?? 20), 100));
            return {
                total: result.total,
                page: result.currentPage,
                perPage: result.perPage,
                posts: result.all().map(postSummary),
            };
        },
    },
    {
        name: 'get_post',
        title: 'Get one post',
        description: 'One post in full, including the body HTML and the SEO fields. Give id or slug.',
        inputSchema: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                slug: { type: 'string' },
            },
        },
        async handler(args) {
            if (!args.id && !args.slug)
                throw new Error('Give either id or slug');
            const post = await Post.query()
                .if(args.id, (q) => q.where('id', Number(args.id)))
                .if(!args.id && args.slug, (q) => q.where('slug', String(args.slug)))
                .preload('category')
                .preload('dates')
                .preload('fees')
                .preload('vacancies')
                .first();
            if (!post)
                throw new Error('No post with that id or slug');
            return {
                ...post.serialize(),
                url: `${env.get('SITE_URL')}/post/${post.slug}`,
                wordCount: plainText(post.content ?? '').split(/\s+/).filter(Boolean).length,
            };
        },
    },
    {
        name: 'create_post',
        title: 'Create a post',
        description: 'Publish a new job notification, result, admit card and so on. Pass the body as ' +
            '`sections` so it is rendered in the site\'s own format. Meta title, description, ' +
            'keywords, the slug and JobPosting structured data are generated unless given. ' +
            'Created as a draft unless status is set to published.',
        inputSchema: {
            type: 'object',
            required: ['title', 'categoryId'],
            properties: POST_WRITE_FIELDS,
        },
        async handler(args) {
            if (!args.title)
                throw new Error('title is required');
            if (!args.categoryId)
                throw new Error('categoryId is required -- call list_categories');
            const category = await Category.find(Number(args.categoryId));
            if (!category)
                throw new Error(`No category with id ${args.categoryId}`);
            const body = buildBody(args);
            const notes = [...body.notes];
            const post = new Post();
            post.merge(postPayload(args));
            post.slug = await uniqueSlug(Post, slugify(args.slug || args.title));
            post.content = body.html ?? '';
            post.status = args.status ?? 'draft';
            post.views = 0;
            post.metaTitle = buildMetaTitle(args.title, args.metaTitle);
            post.metaDescription = buildMetaDescription(args.metaDescription, args.shortDescription, post.content);
            post.metaKeywords = buildKeywords(args.metaKeywords, {
                title: args.title,
                organization: args.organization,
                category: category.name,
                location: args.location,
            });
            if (!args.metaTitle || !args.metaDescription || !args.metaKeywords) {
                notes.push('filled in the SEO fields that were not supplied');
            }
            post.schemaJson = buildSchema({
                title: post.title,
                slug: post.slug,
                shortDescription: post.shortDescription,
                organization: post.organization,
                location: post.location,
                applicationStartDate: post.applicationStartDate?.toISODate() ?? null,
                applicationEndDate: post.applicationEndDate?.toISODate() ?? null,
                totalPosts: post.totalPosts,
            }, env.get('SITE_URL'));
            await post.save();
            return writeResult(post, notes);
        },
    },
    {
        name: 'update_post',
        title: 'Update a post',
        description: 'Change an existing post. Only the fields you pass are touched, so a correction does ' +
            'not blank the rest. Passing `sections` or `contentHtml` replaces the whole body. The ' +
            'slug is left alone unless you pass one.',
        inputSchema: {
            type: 'object',
            required: ['id'],
            properties: { id: { type: 'integer' }, ...POST_WRITE_FIELDS },
        },
        async handler(args) {
            const post = await Post.query().where('id', Number(args.id)).preload('category').first();
            if (!post)
                throw new Error(`No post with id ${args.id}`);
            const notes = [];
            if (args.categoryId !== undefined) {
                const category = await Category.find(Number(args.categoryId));
                if (!category)
                    throw new Error(`No category with id ${args.categoryId}`);
            }
            post.merge(postPayload(args));
            const body = buildBody(args);
            if (body.html !== undefined) {
                post.content = body.html;
                notes.push(...body.notes);
            }
            if (args.slug) {
                post.slug = await uniqueSlug(Post, slugify(args.slug), post.id);
                notes.push(`slug changed to ${post.slug} -- the old URL will 404`);
            }
            if (args.metaTitle !== undefined || !post.metaTitle) {
                post.metaTitle = buildMetaTitle(post.title, args.metaTitle);
            }
            if (args.metaDescription !== undefined || !post.metaDescription) {
                post.metaDescription = buildMetaDescription(args.metaDescription, post.shortDescription, post.content);
            }
            if (args.metaKeywords !== undefined || !post.metaKeywords) {
                post.metaKeywords = buildKeywords(args.metaKeywords, {
                    title: post.title,
                    organization: post.organization,
                    category: post.category?.name,
                    location: post.location,
                });
            }
            await post.save();
            return writeResult(post, notes);
        },
    },
    {
        name: 'delete_post',
        title: 'Delete a post',
        description: 'Permanently remove a post. There is no undo and the URL will 404 afterwards. ' +
            'To take something off the site while keeping it, call update_post with status "draft".',
        destructive: true,
        inputSchema: {
            type: 'object',
            required: ['id'],
            properties: { id: { type: 'integer' } },
        },
        async handler(args) {
            const post = await Post.find(Number(args.id));
            if (!post)
                throw new Error(`No post with id ${args.id}`);
            const { id, title, slug } = post;
            await post.delete();
            return { ok: true, deleted: { id, title, slug } };
        },
    },
    {
        name: 'list_blogs',
        title: 'List blog articles',
        description: 'Blog articles, newest first.',
        inputSchema: {
            type: 'object',
            properties: {
                search: { type: 'string' },
                category: { type: 'string' },
                page: { type: 'integer', minimum: 1 },
                limit: { type: 'integer', minimum: 1, maximum: 100 },
            },
        },
        async handler(args) {
            const query = Blog.query();
            if (args.search)
                query.where('title', 'like', `%${args.search}%`);
            if (args.category)
                query.where('category', String(args.category));
            const result = await query
                .orderBy('createdAt', 'desc')
                .paginate(Number(args.page ?? 1), Math.min(Number(args.limit ?? 20), 100));
            return {
                total: result.total,
                blogs: result.all().map((b) => ({
                    id: b.id,
                    title: b.title,
                    slug: b.slug,
                    category: b.category,
                    status: b.status,
                    isFeatured: b.isFeatured,
                    url: `${env.get('SITE_URL')}/blog/${b.slug}`,
                })),
            };
        },
    },
    {
        name: 'get_blog',
        title: 'Get one blog article',
        description: 'One article in full. Give id or slug.',
        inputSchema: {
            type: 'object',
            properties: { id: { type: 'integer' }, slug: { type: 'string' } },
        },
        async handler(args) {
            if (!args.id && !args.slug)
                throw new Error('Give either id or slug');
            const blog = await Blog.query()
                .if(args.id, (q) => q.where('id', Number(args.id)))
                .if(!args.id && args.slug, (q) => q.where('slug', String(args.slug)))
                .first();
            if (!blog)
                throw new Error('No article with that id or slug');
            return blog.serialize();
        },
    },
    {
        name: 'create_blog',
        title: 'Create a blog article',
        description: 'Write a new article. Same body rules as a post: pass `sections`. Meta fields and the ' +
            'slug are generated when not given.',
        inputSchema: {
            type: 'object',
            required: ['title', 'category'],
            properties: {
                title: { type: 'string' },
                category: { type: 'string', description: 'Category name. See list_blog_categories.' },
                description: { type: 'string', description: 'Short summary, used as the meta description.' },
                sections: SECTION_SCHEMA,
                contentHtml: CONTENT_HTML_SCHEMA,
                image: { type: 'string', description: 'Absolute cover image URL.' },
                slug: { type: 'string' },
                status: { type: 'string', enum: ['draft', 'published'] },
                isFeatured: { type: 'boolean' },
                metaTitle: { type: 'string' },
                metaDescription: { type: 'string' },
                metaKeywords: { type: 'string' },
            },
        },
        async handler(args) {
            if (!args.title)
                throw new Error('title is required');
            if (!args.category)
                throw new Error('category is required');
            const body = buildBody(args);
            const blog = new Blog();
            blog.title = args.title;
            blog.category = args.category;
            blog.description = args.description ?? null;
            blog.content = body.html ?? '';
            blog.image = args.image ?? null;
            blog.status = args.status ?? 'draft';
            blog.isFeatured = Boolean(args.isFeatured);
            blog.slug = await uniqueSlug(Blog, slugify(args.slug || args.title));
            blog.metaTitle = buildMetaTitle(args.title, args.metaTitle);
            blog.metaDescription = buildMetaDescription(args.metaDescription, args.description, blog.content);
            blog.metaKeywords = buildKeywords(args.metaKeywords, {
                title: args.title,
                category: args.category,
            });
            await blog.save();
            return {
                ok: true,
                id: blog.id,
                slug: blog.slug,
                status: blog.status,
                url: `${env.get('SITE_URL')}/blog/${blog.slug}`,
                seo: {
                    metaTitle: blog.metaTitle,
                    metaDescription: blog.metaDescription,
                    metaKeywords: blog.metaKeywords,
                },
                notes: body.notes,
            };
        },
    },
    {
        name: 'update_blog',
        title: 'Update a blog article',
        description: 'Change an article. Only the fields you pass are touched.',
        inputSchema: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
                title: { type: 'string' },
                category: { type: 'string' },
                description: { type: 'string' },
                sections: SECTION_SCHEMA,
                contentHtml: CONTENT_HTML_SCHEMA,
                image: { type: 'string' },
                slug: { type: 'string' },
                status: { type: 'string', enum: ['draft', 'published'] },
                isFeatured: { type: 'boolean' },
                metaTitle: { type: 'string' },
                metaDescription: { type: 'string' },
                metaKeywords: { type: 'string' },
            },
        },
        async handler(args) {
            const blog = await Blog.find(Number(args.id));
            if (!blog)
                throw new Error(`No article with id ${args.id}`);
            const notes = [];
            for (const key of ['title', 'category', 'description', 'image', 'status', 'isFeatured']) {
                if (args[key] !== undefined)
                    blog[key] = args[key];
            }
            const body = buildBody(args);
            if (body.html !== undefined) {
                blog.content = body.html;
                notes.push(...body.notes);
            }
            if (args.slug) {
                blog.slug = await uniqueSlug(Blog, slugify(args.slug), blog.id);
                notes.push(`slug changed to ${blog.slug} -- the old URL will 404`);
            }
            if (args.metaTitle !== undefined || !blog.metaTitle) {
                blog.metaTitle = buildMetaTitle(blog.title, args.metaTitle);
            }
            if (args.metaDescription !== undefined || !blog.metaDescription) {
                blog.metaDescription = buildMetaDescription(args.metaDescription, blog.description, blog.content);
            }
            if (args.metaKeywords !== undefined || !blog.metaKeywords) {
                blog.metaKeywords = buildKeywords(args.metaKeywords, {
                    title: blog.title,
                    category: blog.category,
                });
            }
            await blog.save();
            return { ok: true, id: blog.id, slug: blog.slug, notes };
        },
    },
    {
        name: 'delete_blog',
        title: 'Delete a blog article',
        description: 'Permanently remove an article. There is no undo.',
        destructive: true,
        inputSchema: { type: 'object', required: ['id'], properties: { id: { type: 'integer' } } },
        async handler(args) {
            const blog = await Blog.find(Number(args.id));
            if (!blog)
                throw new Error(`No article with id ${args.id}`);
            const { id, title, slug } = blog;
            await blog.delete();
            return { ok: true, deleted: { id, title, slug } };
        },
    },
    {
        name: 'list_blog_categories',
        title: 'List blog categories',
        description: 'Categories available to blog articles.',
        inputSchema: { type: 'object', properties: {} },
        async handler() {
            const rows = await BlogCategory.query().orderBy('order', 'asc');
            return rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug, status: c.status }));
        },
    },
    {
        name: 'list_pages',
        title: 'List CMS pages',
        description: 'The standalone pages -- About, Privacy Policy, Disclaimer and so on.',
        inputSchema: { type: 'object', properties: {} },
        async handler() {
            const rows = await Page.query().orderBy('title', 'asc');
            return rows.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                url: `${env.get('SITE_URL')}/${p.slug}`,
            }));
        },
    },
    {
        name: 'get_page',
        title: 'Get one CMS page',
        description: 'One page in full. Give id or slug.',
        inputSchema: {
            type: 'object',
            properties: { id: { type: 'integer' }, slug: { type: 'string' } },
        },
        async handler(args) {
            if (!args.id && !args.slug)
                throw new Error('Give either id or slug');
            const page = await Page.query()
                .if(args.id, (q) => q.where('id', Number(args.id)))
                .if(!args.id && args.slug, (q) => q.where('slug', String(args.slug)))
                .first();
            if (!page)
                throw new Error('No page with that id or slug');
            return page.serialize();
        },
    },
    {
        name: 'create_page',
        title: 'Create a CMS page',
        description: 'Add a standalone page. The body follows the same section rules as a post.',
        inputSchema: {
            type: 'object',
            required: ['title'],
            properties: {
                title: { type: 'string' },
                slug: { type: 'string' },
                sections: SECTION_SCHEMA,
                contentHtml: CONTENT_HTML_SCHEMA,
            },
        },
        async handler(args) {
            if (!args.title)
                throw new Error('title is required');
            const body = buildBody(args);
            const page = new Page();
            page.title = args.title;
            page.slug = await uniqueSlug(Page, slugify(args.slug || args.title));
            page.content = body.html ?? '';
            await page.save();
            return {
                ok: true,
                id: page.id,
                slug: page.slug,
                url: `${env.get('SITE_URL')}/${page.slug}`,
                notes: body.notes,
            };
        },
    },
    {
        name: 'update_page',
        title: 'Update a CMS page',
        description: 'Change a page. Only the fields you pass are touched.',
        inputSchema: {
            type: 'object',
            required: ['id'],
            properties: {
                id: { type: 'integer' },
                title: { type: 'string' },
                slug: { type: 'string' },
                sections: SECTION_SCHEMA,
                contentHtml: CONTENT_HTML_SCHEMA,
            },
        },
        async handler(args) {
            const page = await Page.find(Number(args.id));
            if (!page)
                throw new Error(`No page with id ${args.id}`);
            const notes = [];
            if (args.title !== undefined)
                page.title = args.title;
            const body = buildBody(args);
            if (body.html !== undefined) {
                page.content = body.html;
                notes.push(...body.notes);
            }
            if (args.slug) {
                page.slug = await uniqueSlug(Page, slugify(args.slug), page.id);
                notes.push(`slug changed to ${page.slug} -- the old URL will 404`);
            }
            await page.save();
            return { ok: true, id: page.id, slug: page.slug, notes };
        },
    },
    {
        name: 'delete_page',
        title: 'Delete a CMS page',
        description: 'Permanently remove a page. Policy and disclaimer pages are linked from the footer ' +
            'and from the sitemap, so removing one leaves dead links.',
        destructive: true,
        inputSchema: { type: 'object', required: ['id'], properties: { id: { type: 'integer' } } },
        async handler(args) {
            const page = await Page.find(Number(args.id));
            if (!page)
                throw new Error(`No page with id ${args.id}`);
            const { id, title, slug } = page;
            await page.delete();
            return { ok: true, deleted: { id, title, slug } };
        },
    },
    {
        name: 'list_contact_messages',
        title: 'List contact form messages',
        description: 'Messages sent through the contact form, newest first.',
        inputSchema: {
            type: 'object',
            properties: {
                page: { type: 'integer', minimum: 1 },
                limit: { type: 'integer', minimum: 1, maximum: 100 },
            },
        },
        async handler(args) {
            const result = await ContactMessage.query()
                .orderBy('createdAt', 'desc')
                .paginate(Number(args.page ?? 1), Math.min(Number(args.limit ?? 20), 100));
            return { total: result.total, messages: result.all().map((m) => m.serialize()) };
        },
    },
    {
        name: 'preview_content',
        title: 'Preview rendered content',
        description: 'Render sections to HTML and show the SEO fields that would be generated, without ' +
            'writing anything. Use this to check the shape of a long post before creating it.',
        inputSchema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                shortDescription: { type: 'string' },
                organization: { type: 'string' },
                category: { type: 'string' },
                location: { type: 'string' },
                sections: SECTION_SCHEMA,
                contentHtml: CONTENT_HTML_SCHEMA,
            },
        },
        async handler(args) {
            const body = buildBody(args);
            const html = body.html ?? '';
            return {
                html,
                wordCount: plainText(html).split(/\s+/).filter(Boolean).length,
                notes: body.notes,
                seo: {
                    slug: slugify(args.title ?? ''),
                    metaTitle: buildMetaTitle(args.title ?? '', null),
                    metaDescription: buildMetaDescription(null, args.shortDescription, html),
                    metaKeywords: buildKeywords(null, {
                        title: args.title,
                        organization: args.organization,
                        category: args.category,
                        location: args.location,
                    }),
                },
            };
        },
    },
];
export const TOOLS_BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));
//# sourceMappingURL=tools.js.map