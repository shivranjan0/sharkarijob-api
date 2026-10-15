import vine from '@vinejs/vine';
import Blog from '#models/blog';
import { safePage, safeLimit, safeString } from '#services/query_params';
const blogFields = {
    title: vine.string().trim().minLength(3).maxLength(255),
    slug: vine.string().trim().maxLength(255).optional(),
    category: vine.string().trim().maxLength(255).optional().nullable(),
    description: vine.string().trim().maxLength(2000).optional().nullable(),
    tableOfContents: vine.string().optional().nullable(),
    content: vine.string().optional().nullable(),
    image: vine.string().trim().maxLength(500).optional().nullable(),
    isFeatured: vine.boolean().optional(),
    status: vine.number().min(0).max(1).optional(),
    metaTitle: vine.string().trim().maxLength(255).optional().nullable(),
    metaDescription: vine.string().trim().maxLength(500).optional().nullable(),
    metaKeywords: vine.string().trim().maxLength(500).optional().nullable(),
};
const createBlogValidator = vine.compile(vine.object(blogFields));
const updateBlogValidator = vine.compile(vine.object({ ...blogFields, title: vine.string().trim().minLength(3).maxLength(255).optional() }));
export default class AdminBlogsController {
    slugify(value) {
        const slug = value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 200);
        return slug || `blog-${Date.now()}`;
    }
    async uniqueSlug(base, ignoreId) {
        let candidate = base;
        let n = 1;
        while (true) {
            const q = Blog.query().where('slug', candidate);
            if (ignoreId)
                q.whereNot('id', ignoreId);
            if (!(await q.first()))
                return candidate;
            n++;
            candidate = `${base}-${n}`;
        }
    }
    async index({ request, response }) {
        const page = safePage(request.input('page', 1));
        const limit = safeLimit(request.input('limit', 20), 20, 100);
        const search = safeString(request.input('search', '')) ?? '';
        const query = Blog.query();
        if (search) {
            query.where((b) => {
                b.where('title', 'like', `%${search}%`).orWhere('slug', 'like', `%${search}%`);
            });
        }
        return response.ok(await query.orderBy('createdAt', 'desc').paginate(page, limit));
    }
    async show({ params, response }) {
        const blog = await Blog.find(params.id);
        if (!blog)
            return response.notFound({ message: 'Blog not found' });
        return response.ok(blog);
    }
    async store({ request, response }) {
        const data = await request.validateUsing(createBlogValidator);
        const base = this.slugify(String(data.slug || data.title));
        const blog = await Blog.create({ ...data, slug: await this.uniqueSlug(base) });
        return response.created(blog);
    }
    async update({ params, request, response }) {
        const blog = await Blog.find(params.id);
        if (!blog)
            return response.notFound({ message: 'Blog not found' });
        const data = await request.validateUsing(updateBlogValidator);
        if (data.slug) {
            blog.slug = await this.uniqueSlug(this.slugify(data.slug), blog.id);
        }
        const { slug: _ignored, ...rest } = data;
        blog.merge(rest);
        await blog.save();
        return response.ok(blog);
    }
    async destroy({ params, response }) {
        const blog = await Blog.find(params.id);
        if (!blog)
            return response.notFound({ message: 'Blog not found' });
        await blog.delete();
        return response.ok({ message: 'Blog deleted', id: Number(params.id) });
    }
}
//# sourceMappingURL=admin_blogs_controller.js.map