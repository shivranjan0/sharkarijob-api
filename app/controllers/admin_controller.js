import Review from '#models/review';
import User from '#models/user';
import { safePage, safeLimit, safeString } from '#services/query_params';
// Note: categories/pages/subscribers admin listing used to live here as
// dead, unrouted methods (AdminResourcesController's generic resource
// handler already covers all three). Removed rather than fixed in place.
export default class AdminController {
    async reviews({ request, response }) {
        const page = safePage(request.input('page', 1));
        const limit = safeLimit(request.input('limit', 25), 25, 100);
        const status = safeString(request.input('status'));
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
        const page = safePage(request.input('page', 1));
        const limit = safeLimit(request.input('limit', 15), 15, 100);
        const users = await User.query().where('is_admin', true).paginate(page, limit);
        const data = users.all().map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: 'Admin',
        }));
        return response.ok(data);
    }
}
//# sourceMappingURL=admin_controller.js.map