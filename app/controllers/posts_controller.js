import db from '@adonisjs/lucid/services/db';
import Post from '#models/post';
import { STATES } from '../lib_states.js';
import { getPostQuality } from '../services/post_quality.js';
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
        const CATEGORY_KEYS = [
            ['Latest Jobs', 'latestJobs'],
            ['Results', 'results'],
            ['Admit Card', 'admitCards'],
            ['Answer Key', 'answerKeys'],
            ['Admission', 'admissions'],
            ['Syllabus', 'syllabuses'],
        ];
        const names = CATEGORY_KEYS.map(([name]) => name);
        const [idRows] = await db.rawQuery(`select id from (
         select p.id, row_number() over (partition by p.category_id order by p.created_at desc, p.id desc) as rn
         from posts p
         where p.status = 'published'
           and p.category_id in (select id from categories where name in (${names.map(() => '?').join(',')}))
       ) ranked where rn <= 6
       union
       select id from (select id from posts where status = 'published' and is_trending = 1 order by created_at desc, id desc limit 10) t
       union
       select id from (select id from posts where status = 'published' and is_featured = 1 order by created_at desc, id desc limit 10) f`, names);
        const ids = idRows.map((r) => r.id);
        const posts = ids.length
            ? await Post.query()
                .select(LIST_COLUMNS)
                .whereIn('id', ids)
                .preload('category', (q) => q.select('id', 'name', 'slug'))
                .orderBy('createdAt', 'desc')
                .orderBy('id', 'desc')
            : [];
        const categories = {};
        for (const [name, key] of CATEGORY_KEYS) {
            categories[key] = posts.filter((p) => p.category?.name === name).slice(0, 6);
        }
        return response.ok({
            trendingPosts: posts.filter((p) => p.isTrending).slice(0, 10),
            featuredPosts: posts.filter((p) => p.isFeatured).slice(0, 10),
            categories,
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
        const quality = (await getPostQuality()).get(post.slug);
        return response.ok({
            data: {
                ...post.serialize(),
                content: post.cleanContent,
                canonicalSlug: quality?.canonicalSlug ?? null,
                redirectTo: quality?.redirectTo ?? null,
                noindex: quality?.noindex ?? false,
            }
        });
    }
}
//# sourceMappingURL=posts_controller.js.map