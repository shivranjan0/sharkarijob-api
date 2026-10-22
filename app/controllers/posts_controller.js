import Post from '#models/post';
import { STATES } from '../lib_states.js';
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
const QUALIFICATION_PATTERNS = {
    '10th-pass': '\\b(10th|matriculation)\\b',
    '12th-pass': '\\b(12th|intermediate|10\\+2)\\b',
    graduate: '\\b(graduate|graduation|bachelor|degree)\\b',
    iti: '\\b(iti)\\b',
    diploma: '\\b(diploma)\\b',
};
export default class PostsController {
    async index({ request, response }) {
        const page = request.input('page', 1);
        const limit = request.input('limit', 15);
        const categoryName = request.input('category');
        const search = request.input('search');
        const sort = request.input('sort');
        const qualification = QUALIFICATION_PATTERNS[String(request.input('qualification', ''))];
        const activeOnly = request.input('active') === '1';
        const stateName = STATES[String(request.input('state', ''))];
        const upcomingExam = request.input('upcoming_exam') === '1';
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
        if (qualification) {
            query = query.where((builder) => {
                builder
                    .whereRaw('title REGEXP ?', [qualification])
                    .orWhereRaw('short_description REGEXP ?', [qualification])
                    .orWhereRaw('content REGEXP ?', [qualification]);
            });
        }
        if (stateName)
            query = query.where('location', 'like', `%${stateName}%`);
        if (upcomingExam)
            query = query.whereNotNull('exam_date').whereRaw('exam_date >= CURDATE()');
        if (activeOnly) {
            query = query.where((builder) => {
                builder.whereNull('application_end_date').orWhereRaw('application_end_date >= CURDATE()');
            });
        }
        const ORDERINGS = Object.assign(Object.create(null), {
            latest: ['createdAt', 'desc'],
            oldest: ['createdAt', 'asc'],
            popular: ['views', 'desc'],
            exam: ['examDate', 'asc'],
            title: ['title', 'asc'],
        });
        const [column, direction] = ORDERINGS[String(sort ?? '').toLowerCase()] ?? ORDERINGS.latest;
        query = query.orderBy(column, direction);
        if (column !== 'id')
            query = query.orderBy('id', 'desc');
        const posts = await query.paginate(page, limit);
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
            .preload('category')
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