import Category from '#models/category';
import Page from '#models/page';
import Review from '#models/review';
import Subscriber from '#models/subscriber';
import User from '#models/user';
export default class AdminController {
    async categories({ request, response }) {
        const page = request.input('page', 1);
        const limit = request.input('limit', 15);
        const categories = await Category.query().withCount('posts').paginate(page, limit);
        const data = categories.all().map((c) => ({
            id: c.id,
            name: c.name,
            count: Number(c.$extras.posts_count ?? 0),
        }));
        return response.ok(data);
    }
    async pages({ request, response }) {
        const pageNum = request.input('page', 1);
        const limit = request.input('limit', 15);
        const pages = await Page.query().paginate(pageNum, limit);
        const data = pages.all().map((p) => ({
            id: p.id,
            title: p.title,
            slug: `/${p.slug}`,
        }));
        return response.ok(data);
    }
    async reviews({ request, response }) {
        const page = request.input('page', 1);
        const limit = request.input('limit', 15);
        const reviews = await Review.query().orderBy('createdAt', 'desc').paginate(page, limit);
        const data = reviews.all().map((r) => ({
            id: r.id,
            user: r.name,
            rating: r.rating,
            comment: r.comment,
            status: r.status === 'approved' ? 'Approved' : 'Pending',
        }));
        return response.ok(data);
    }
    async admins({ request, response }) {
        const page = request.input('page', 1);
        const limit = request.input('limit', 15);
        const users = await User.query().where('is_admin', true).paginate(page, limit);
        const data = users.all().map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: 'Admin',
        }));
        return response.ok(data);
    }
    async subscribers({ request, response }) {
        const page = request.input('page', 1);
        const limit = request.input('limit', 15);
        const subscribers = await Subscriber.query().orderBy('createdAt', 'desc').paginate(page, limit);
        const data = subscribers.all().map((s) => ({
            id: s.id,
            email: s.email,
            date: s.createdAt?.toISODate() ?? null,
        }));
        return response.ok(data);
    }
}
//# sourceMappingURL=admin_controller.js.map