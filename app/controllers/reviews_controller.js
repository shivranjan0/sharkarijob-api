import Review from '#models/review';
import { createReviewValidator } from '#validators/review';
export default class ReviewsController {
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