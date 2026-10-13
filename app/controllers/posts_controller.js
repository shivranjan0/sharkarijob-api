import Post from '#models/post';
export default class PostsController {
    async index({ request, response }) {
        const page = request.input('page', 1);
        const limit = request.input('limit', 15);
        const categoryName = request.input('category');
        const search = request.input('search');
        let query = Post.query()
            .where('status', 'published')
            .preload('category');
        if (categoryName) {
            query = query.whereHas('category', (catQuery) => {
                catQuery.where('name', categoryName);
            });
        }
        if (search) {
            query = query.where('title', 'like', `%${search}%`);
        }
        const posts = await query.orderBy('createdAt', 'desc').paginate(page, limit);
        return response.ok(posts);
    }
    async homeData({ response }) {
        const getPostsByCategory = async (categoryName, limit = 6) => {
            return Post.query()
                .whereHas('category', (query) => {
                query.where('name', categoryName);
            })
                .where('status', 'published')
                .orderBy('createdAt', 'desc')
                .limit(limit);
        };
        const [trendingPosts, featuredPosts, latestJobs, results, admitCards, answerKeys, admissions, syllabuses] = await Promise.all([
            Post.query().where('isTrending', true).where('status', 'published').preload('category').orderBy('createdAt', 'desc').limit(10),
            Post.query().where('isFeatured', true).where('status', 'published').preload('category').orderBy('createdAt', 'desc').limit(10),
            getPostsByCategory('Latest Jobs', 6),
            getPostsByCategory('Results', 6),
            getPostsByCategory('Admit Card', 6),
            getPostsByCategory('Answer Key', 6),
            getPostsByCategory('Admission', 6),
            getPostsByCategory('Syllabus', 6),
        ]);
        return response.ok({
            trendingPosts,
            featuredPosts,
            categories: {
                latestJobs,
                results,
                admitCards,
                answerKeys,
                admissions,
                syllabuses
            }
        });
    }
    async show({ params, response }) {
        const post = await Post.query()
            .where('slug', params.slug)
            .preload('dates')
            .preload('fees')
            .preload('vacancies')
            .preload('media')
            .firstOrFail();
        return response.ok({
            data: {
                ...post.serialize(),
                content: post.cleanContent
            }
        });
    }
}
//# sourceMappingURL=posts_controller.js.map