import vine from '@vinejs/vine';
const postFields = {
    title: vine.string().trim().minLength(3).maxLength(255),
    slug: vine.string().trim().maxLength(255).optional(),
    categoryId: vine.number().positive(),
    shortDescription: vine.string().trim().maxLength(1000).optional().nullable(),
    content: vine.string().optional().nullable(),
    status: vine.enum(['draft', 'published']).optional(),
    organization: vine.string().trim().maxLength(255).optional().nullable(),
    location: vine.string().trim().maxLength(255).optional().nullable(),
    totalPosts: vine.number().min(0).optional().nullable(),
    applicationStartDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional().nullable(),
    applicationEndDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional().nullable(),
    examDate: vine.date({ formats: ['YYYY-MM-DD'] }).optional().nullable(),
    applyOnlineUrl: vine.string().trim().url().maxLength(500).optional().nullable(),
    officialNotificationUrl: vine.string().trim().url().maxLength(500).optional().nullable(),
    officialWebsiteUrl: vine.string().trim().url().maxLength(500).optional().nullable(),
    thumbnail: vine.string().trim().maxLength(500).optional().nullable(),
    banner: vine.string().trim().maxLength(500).optional().nullable(),
    isFeatured: vine.boolean().optional(),
    isTrending: vine.boolean().optional(),
    isLive: vine.boolean().optional(),
    metaTitle: vine.string().trim().maxLength(255).optional().nullable(),
    metaDescription: vine.string().trim().maxLength(500).optional().nullable(),
    metaKeywords: vine.string().trim().maxLength(500).optional().nullable(),
};
export const createPostValidator = vine.compile(vine.object(postFields));
export const updatePostValidator = vine.compile(vine.object({
    ...postFields,
    title: vine.string().trim().minLength(3).maxLength(255).optional(),
    categoryId: vine.number().positive().optional(),
}));
//# sourceMappingURL=admin_post.js.map