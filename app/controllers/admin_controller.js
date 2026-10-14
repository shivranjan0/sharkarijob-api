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
        const limit = Math.min(Number(request.input('limit', 25)), 100);
        const status = request.input('status');
        const query = Review.query().orderBy('createdAt', 'desc');
        if (status === 'pending' || status === 'approved') {
            query.where('status', status);
        }
        const reviews = await query.paginate(page, limit);
        return response.ok({
            meta: reviews.getMeta(),
            data: reviews.all().map((r) => ({
                id: r.id,
                name: r.name,
                email: r.email,
                location: r.location,
                rating: r.rating,
                comment: r.comment,
                status: r.status,
                createdAt: r.createdAt,
            })),
        });
    }
    async updateReviewStatus({ params, request, response }) {
        const review = await Review.find(params.id);
        if (!review)
            return response.notFound({ message: 'Review not found' });
        const status = String(request.input('status', '')).trim();
        if (status !== 'pending' && status !== 'approved') {
            return response.unprocessableEntity({
                message: "status must be 'pending' or 'approved'",
            });
        }
        review.status = status;
        await review.save();
        return response.ok({ message: `Review ${status}`, id: review.id, status });
    }
    async destroyReview({ params, response }) {
        const review = await Review.find(params.id);
        if (!review)
            return response.notFound({ message: 'Review not found' });
        await review.delete();
        return response.ok({ message: 'Review deleted', id: Number(params.id) });
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