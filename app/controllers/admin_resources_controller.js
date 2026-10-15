import vine from '@vinejs/vine';
import Category from '#models/category';
import BlogCategory from '#models/blog_category';
import Page from '#models/page';
import SocialMedia from '#models/social_media';
import Subscriber from '#models/subscriber';
import HomepageSection from '#models/homepage_section';
import Review from '#models/review';
import User from '#models/user';
import { safePage, safeLimit, safeString } from '#services/query_params';
const slugField = vine.string().trim().maxLength(255).optional();
const RESOURCES = {
    categories: {
        model: Category,
        schema: {
            name: vine.string().trim().minLength(2).maxLength(255),
            slug: slugField,
            order: vine.number().min(0).optional(),
            status: vine.number().min(0).max(1).optional(),
        },
        searchable: ['name', 'slug'],
        orderBy: ['order', 'asc'],
    },
    'blog-categories': {
        model: BlogCategory,
        schema: {
            name: vine.string().trim().minLength(2).maxLength(255),
            slug: slugField,
            order: vine.number().min(0).optional(),
            status: vine.number().min(0).max(1).optional(),
        },
        searchable: ['name', 'slug'],
        orderBy: ['order', 'asc'],
    },
    pages: {
        model: Page,
        schema: {
            title: vine.string().trim().minLength(2).maxLength(255),
            slug: slugField,
            content: vine.string().optional().nullable(),
        },
        searchable: ['title', 'slug'],
        orderBy: ['id', 'asc'],
    },
    'social-media': {
        model: SocialMedia,
        schema: {
            platformName: vine.string().trim().minLength(2).maxLength(255),
            url: vine.string().trim().url().maxLength(500),
            iconClass: vine.string().trim().maxLength(255).optional().nullable(),
            isActive: vine.boolean().optional(),
            order: vine.number().min(0).optional(),
        },
        searchable: ['platform_name'],
        orderBy: ['order', 'asc'],
    },
    sections: {
        model: HomepageSection,
        schema: {
            title: vine.string().trim().minLength(2).maxLength(255),
            postLimit: vine.number().min(0).max(50).optional(),
            sortBy: vine.string().trim().maxLength(50).optional().nullable(),
            isEnabled: vine.boolean().optional(),
        },
        searchable: ['title', 'section_key'],
        orderBy: ['id', 'asc'],
    },
    subscribers: {
        model: Subscriber,
        schema: {},
        searchable: ['email'],
        orderBy: ['created_at', 'desc'],
        readOnly: true,
    },
};
export default class AdminResourcesController {
    resolve(name) {
        return Object.prototype.hasOwnProperty.call(RESOURCES, name) ? RESOURCES[name] : null;
    }
    slugify(value) {
        const slug = value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 200);
        return slug || `item-${Date.now()}`;
    }
    async uniqueSlug(model, base, ignoreId) {
        let candidate = base;
        let n = 1;
        while (true) {
            const q = model.query().where('slug', candidate);
            if (ignoreId)
                q.whereNot('id', ignoreId);
            if (!(await q.first()))
                return candidate;
            n++;
            candidate = `${base}-${n}`;
        }
    }
    hasSlug(def) {
        return 'slug' in def.schema;
    }
    async index({ params, request, response }) {
        const def = this.resolve(params.resource);
        if (!def)
            return response.notFound({ message: 'Unknown resource' });
        const page = safePage(request.input('page', 1));
        const limit = safeLimit(request.input('limit', 50), 50, 200);
        const search = safeString(request.input('search', '')) ?? '';
        const query = def.model.query();
        if (search && def.searchable.length) {
            query.where((b) => {
                def.searchable.forEach((col, i) => {
                    const like = `%${search}%`;
                    i === 0 ? b.where(col, 'like', like) : b.orWhere(col, 'like', like);
                });
            });
        }
        const rows = await query.orderBy(def.orderBy[0], def.orderBy[1]).paginate(page, limit);
        return response.ok(rows);
    }
    async show({ params, response }) {
        const def = this.resolve(params.resource);
        if (!def)
            return response.notFound({ message: 'Unknown resource' });
        const row = await def.model.find(params.id);
        if (!row)
            return response.notFound({ message: 'Not found' });
        return response.ok(row);
    }
    async store({ params, request, response }) {
        const def = this.resolve(params.resource);
        if (!def)
            return response.notFound({ message: 'Unknown resource' });
        if (def.readOnly)
            return response.methodNotAllowed({ message: 'This list is read-only' });
        const data = await vine.compile(vine.object(def.schema)).validate(request.all());
        if (this.hasSlug(def)) {
            const source = data.slug || data.name || data.title;
            data.slug = await this.uniqueSlug(def.model, this.slugify(String(source)));
        }
        const row = await def.model.create(data);
        return response.created(row);
    }
    async update({ params, request, response }) {
        const def = this.resolve(params.resource);
        if (!def)
            return response.notFound({ message: 'Unknown resource' });
        if (def.readOnly)
            return response.methodNotAllowed({ message: 'This list is read-only' });
        const row = await def.model.find(params.id);
        if (!row)
            return response.notFound({ message: 'Not found' });
        const optional = {};
        for (const [key, rule] of Object.entries(def.schema)) {
            optional[key] = typeof rule.optional === 'function' ? rule.optional() : rule;
        }
        const data = await vine.compile(vine.object(optional)).validate(request.all());
        if (this.hasSlug(def) && data.slug) {
            ;
            data.slug = await this.uniqueSlug(def.model, this.slugify(String(data.slug)), row.id);
        }
        row.merge(data);
        await row.save();
        return response.ok(row);
    }
    async destroy({ params, response }) {
        const def = this.resolve(params.resource);
        if (!def)
            return response.notFound({ message: 'Unknown resource' });
        const row = await def.model.find(params.id);
        if (!row)
            return response.notFound({ message: 'Not found' });
        await row.delete();
        return response.ok({ message: 'Deleted', id: Number(params.id) });
    }
    async dashboard({ response }) {
        const [posts, published, drafts, views] = await Promise.all([
            (await import('#models/post')).default.query().count('* as total'),
            (await import('#models/post')).default.query().where('status', 'published').count('* as total'),
            (await import('#models/post')).default.query().where('status', 'draft').count('* as total'),
            (await import('#models/post')).default.query().sum('views as total'),
        ]);
        const num = (rows) => Number(rows[0]?.$extras?.total ?? 0);
        const [categories, blogs, pages, subscribers, reviews, admins] = await Promise.all([
            Category.query().count('* as total'),
            (await import('#models/blog')).default.query().count('* as total'),
            Page.query().count('* as total'),
            Subscriber.query().count('* as total'),
            Review.query().where('status', 'pending').count('* as total'),
            User.query().where('is_admin', true).count('* as total'),
        ]);
        const latest = await (await import('#models/post')).default
            .query()
            .preload('category')
            .orderBy('createdAt', 'desc')
            .limit(5);
        return response.ok({
            totalPosts: num(posts),
            publishedPosts: num(published),
            draftPosts: num(drafts),
            totalViews: num(views),
            categories: num(categories),
            blogs: num(blogs),
            pages: num(pages),
            subscribers: num(subscribers),
            pendingReviews: num(reviews),
            admins: num(admins),
            latestPosts: latest.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                status: p.status,
                category: p.category?.name ?? null,
                createdAt: p.createdAt,
            })),
        });
    }
}
//# sourceMappingURL=admin_resources_controller.js.map