import Review from '#models/review';
import { createReviewValidator } from '#validators/review';
export default class ReviewsController {
    async index({ request, response }) {
        const limit = Math.min(Number(request.input('limit', 12)), 50);
        const reviews = await Review.query()
            .where('status', 'approved')
            .orderBy('createdAt', 'desc')
            .limit(limit);
        const [stats] = await Review.query()
            .where('status', 'approved')
            .avg('rating as average')
            .count('* as total');
        const average = Number(stats?.$extras?.average ?? 0);
        const total = Number(stats?.$extras?.total ?? 0);
        return response.ok({
            averageRating: total > 0 ? Math.round(average * 10) / 10 : null,
            total,
            data: reviews.map((r) => ({
                id: r.id,
                name: r.name,
                location: r.location,
                rating: r.rating,
                comment: r.comment,
                avatar: r.avatar,
                createdAt: r.createdAt,
            })),
        });
    }
    async store({ request, auth, response }) {
        const payload = await request.validateUsing(createReviewValidator);
        const userId = auth.user?.id || null;
        const review = await Review.create({
            userId: userId,
            name: payload.name,
            email: payload.email,
            rating: payload.rating,
            comment: payload.comment,
            location: payload.location,
            status: 'pending'
        });
        return response.created({
            message: 'Thank you! Your review has been submitted for approval.',
            data: review
        });
    }
}
//# sourceMappingURL=reviews_controller.js.map