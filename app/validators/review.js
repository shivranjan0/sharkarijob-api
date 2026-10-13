import vine from '@vinejs/vine';
export const createReviewValidator = vine.compile(vine.object({
    name: vine.string().maxLength(255),
    email: vine.string().email().maxLength(255),
    rating: vine.number().min(1).max(5),
    comment: vine.string().maxLength(1000),
    location: vine.string().maxLength(255).optional()
}));
//# sourceMappingURL=review.js.map