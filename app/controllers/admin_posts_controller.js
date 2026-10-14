import Post from '#models/post';
import Category from '#models/category';
import { createPostValidator, updatePostValidator } from '#validators/admin_post';
export default class AdminPostsController {
    slugify(value) {
        const slug = value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 200);
        return slug || `post-${Date.now()}`;
    }
    async uniqueSlug(base, ignoreId) {
        let candidate = base;
        let suffix = 1;
        while (true) {
            const query = Post.query().where('slug', candidate);
            if (ignoreId)
                query.whereNot('id', ignoreId);
            const clash = await query.first();
            if (!clash)
                return candidate;
            suffix++;
            candidate = `${base}-${suffix}`;
        }
    }
    async index({ request, response }) {
        const page = request.input('page', 1);
        const limit = Math.min(Number(request.input('limit', 20)), 100);
        const search = request.input('search');
        const status = request.input('status');
        const categoryId = request.input('categoryId');
        const query = Post.query().preload('category');
        if (search) {
            query.where((builder) => {
                builder.where('title', 'like', `%${search}%`).orWhere('slug', 'like', `%${search}%`);
            });
        }
        if (status)
            query.where('status', status);
        if (categoryId)
            query.where('category_id', categoryId);
        const posts = await query.orderBy('createdAt', 'desc').paginate(page, limit);
        return response.ok(posts);
    }
    async show({ params, response }) {
        const post = await Post.query()
            .where('id', params.id)
            .preload('category')
            .preload('dates')
            .preload('fees')
            .preload('vacancies')
            .first();
        if (!post) {
            return response.notFound({ message: 'Post not found' });
        }
        return response.ok(post);
    }
    async categoryMissing(categoryId) {
        if (categoryId === undefined)
            return false;
        const category = await Category.find(categoryId);
        return !category;
    }
    async store({ request, response }) {
        const data = await request.validateUsing(createPostValidator);
        if (await this.categoryMissing(data.categoryId)) {
            return response.unprocessableEntity({
                message: 'Validation failure',
                errors: [{ field: 'categoryId', message: 'Category does not exist' }],
            });
        }
        const base = data.slug ? this.slugify(data.slug) : this.slugify(data.title);
        const slug = await this.uniqueSlug(base);
        const post = await Post.create({
            ...data,
            slug,
            status: data.status ?? 'draft',
            views: 0,
        });
        await post.load('category');
        return response.created(post);
    }
    async update({ params, request, response }) {
        const post = await Post.find(params.id);
        if (!post) {
            return response.notFound({ message: 'Post not found' });
        }
        const data = await request.validateUsing(updatePostValidator);
        if (await this.categoryMissing(data.categoryId)) {
            return response.unprocessableEntity({
                message: 'Validation failure',
                errors: [{ field: 'categoryId', message: 'Category does not exist' }],
            });
        }
        if (data.slug) {
            const base = this.slugify(data.slug);
            post.slug = await this.uniqueSlug(base, post.id);
        }
        const { slug: _ignored, ...rest } = data;
        post.merge(rest);
        await post.save();
        await post.load('category');
        return response.ok(post);
    }
    async destroy({ params, response }) {
        const post = await Post.find(params.id);
        if (!post) {
            return response.notFound({ message: 'Post not found' });
        }
        await post.delete();
        return response.ok({ message: 'Post deleted', id: Number(params.id) });
    }
}
//# sourceMappingURL=admin_posts_controller.js.map