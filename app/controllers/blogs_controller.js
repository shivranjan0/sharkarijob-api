import Blog from '#models/blog';
import BlogCategory from '#models/blog_category';
import { safePage, safeLimit, safeString } from '#services/query_params';
export default class BlogsController {
    async index({ request, response }) {
        const page = safePage(request.input('page', 1));
        const limit = safeLimit(request.input('limit', 12), 12, 50);
        const categorySlug = safeString(request.input('category'));
        const search = safeString(request.input('search'));
        const query = Blog.query().where('status', 'published');
        if (categorySlug) {
            const category = await BlogCategory.findBy('slug', categorySlug);
            if (!category) {
                return response.notFound({ message: 'Blog category not found' });
            }
            query.where('category', category.name);
        }
        if (search) {
            query.where((builder) => {
                builder.where('title', 'like', `%${search}%`).orWhere('description', 'like', `%${search}%`);
            });
        }
        const blogs = await query.orderBy('createdAt', 'desc').orderBy('id', 'desc').paginate(page, limit);
        return response.ok(blogs);
    }
    async show({ params, response }) {
        const blog = await Blog.query()
            .where('slug', params.slug)
            .where('status', 'published')
            .first();
        if (!blog) {
            return response.notFound({ message: 'Blog not found' });
        }
        return response.ok({ data: blog });
    }
    async categories({ response }) {
        const categories = await BlogCategory.query()
            .where('status', true)
            .orderBy('order', 'asc')
            .orderBy('name', 'asc');
        return response.ok({ data: categories });
    }
}
//# sourceMappingURL=blogs_controller.js.map