import Post from '#models/post';
import { safePage, safeLimit, safeString } from '#services/query_params';
const LIST_COLUMNS = [
    'id',
    'category_id',
    'title',
    'slug',
    'short_description',
    'organization',
    'location',
    'total_posts',
    'application_start_date',
    'application_end_date',
    'exam_date',
    'thumbnail',
    'status',
    'is_live',
    'is_featured',
    'is_trending',
    'views',
    'created_at',
    'updated_at',
];
export default class PostsController {
    async index({ request, response }) {
        const page = safePage(request.input('page', 1));
        const limit = safeLimit(request.input('limit', 15), 15, 100);
        const categoryName = safeString(request.input('category'));
        const search = safeString(request.input('search'));
        let query = Post.query()
            .select(LIST_COLUMNS)
            .where('status', 'published')
            .preload('category', (q) => q.select('id', 'name', 'slug'));
        if (categoryName) {
            query = query.whereHas('category', (catQuery) => {
                catQuery.where('name', categoryName);
            });
        }
        if (search) {
            const like = `%${search}%`;
            query = query.where((builder) => {
                builder
                    .where('title', 'like', like)
                    .orWhere('organization', 'like', like)
                    .orWhere('short_description', 'like', like);
            });
        }
        const posts = await query.orderBy('createdAt', 'desc').paginate(page, limit);
        return response.ok(posts);
    }
    async homeData({ response }) {
        const preloadCategory = (query) => query.select('id', 'name', 'slug');
        const getPostsByCategory = async (categoryName, limit = 6) => {
            return Post.query()
                .select(LIST_COLUMNS)
                .whereHas('category', (query) => {
                query.where('name', categoryName);
            })
                .where('status', 'published')
                .orderBy('createdAt', 'desc')
                .limit(limit);
        };
        const [trendingPosts, featuredPosts, latestJobs, results, admitCards, answerKeys, admissions, syllabuses] = await Promise.all([
            Post.query().select(LIST_COLUMNS).where('isTrending', true).where('status', 'published').preload('category', preloadCategory).orderBy('createdAt', 'desc').limit(10),
            Post.query().select(LIST_COLUMNS).where('isFeatured', true).where('status', 'published').preload('category', preloadCategory).orderBy('createdAt', 'desc').limit(10),
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
            .where('status', 'published')
            // The index endpoint has always preloaded the category; show did
            // not, so a single post came back with a bare categoryId and no
            // name. Anything consuming this endpoint had no way to tell a
            // vacancy from a result page -- which the SEO worker needs in
            // order to decide between JobPosting and Article schema, and to
            // build the breadcrumb trail.
            .preload('category', (q) => q.select('id', 'name', 'slug'))
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