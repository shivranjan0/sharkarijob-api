import vine from '@vinejs/vine';
import { DateTime } from 'luxon';
import Paper from '#models/paper';
const questionSchema = vine.object({
    n: vine.number(),
    topic: vine.string().trim().maxLength(60),
    text: vine.string().trim().minLength(3),
    options: vine.array(vine.string().trim().minLength(1)).minLength(2).maxLength(6),
    answer: vine.number().min(0),
    explanation: vine.string().trim().minLength(3),
    verifiedAgainstKey: vine.boolean(),
});
const paperFields = {
    exam: vine.string().trim().maxLength(100),
    examName: vine.string().trim().maxLength(150),
    year: vine.number().min(2000).max(2100),
    shift: vine.string().trim().maxLength(100).optional().nullable(),
    examDate: vine.string().trim().optional().nullable(),
    markingScheme: vine.string().trim().maxLength(500).optional().nullable(),
    pdfUrl: vine.string().trim().maxLength(500).optional().nullable(),
    uploadedBy: vine.string().trim().maxLength(150).optional().nullable(),
    status: vine.enum(['pending', 'approved', 'rejected']).optional(),
    questions: vine.array(questionSchema).optional(),
};
const createValidator = vine.compile(vine.object(paperFields));
const updateValidator = vine.compile(vine.object({
    ...paperFields,
    exam: vine.string().trim().maxLength(100).optional(),
    examName: vine.string().trim().maxLength(150).optional(),
    year: vine.number().min(2000).max(2100).optional(),
}));
const slugify = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
function badAnswers(questions) {
    return (questions ?? []).filter((q) => q.answer >= q.options.length).map((q) => q.n);
}
export default class AdminPapersController {
    async index({ request, response }) {
        const page = request.input('page', 1);
        const limit = Math.min(Number(request.input('limit', 20)), 100);
        const query = Paper.query().select('id', 'slug', 'exam', 'exam_name', 'year', 'shift', 'status', 'total_questions', 'uploaded_by', 'updated_at');
        const search = String(request.input('search', '')).trim();
        if (search) {
            query.where((b) => b.where('exam_name', 'like', `%${search}%`).orWhere('slug', 'like', `%${search}%`));
        }
        return response.ok(await query.orderBy('id', 'desc').paginate(page, limit));
    }
    async show({ params, response }) {
        const paper = await Paper.find(params.id);
        if (!paper)
            return response.notFound({ message: 'Paper not found' });
        return response.ok(paper.serialize());
    }
    async store({ request, response }) {
        const data = await request.validateUsing(createValidator);
        const bad = badAnswers(data.questions);
        if (bad.length) {
            return response.unprocessableEntity({ message: `Answer index out of range in question(s): ${bad.join(', ')}` });
        }
        const base = slugify([data.exam, data.year, data.shift].filter(Boolean).join(' '));
        let slug = base;
        for (let n = 2; await Paper.findBy('slug', slug); n++)
            slug = `${base}-${n}`;
        const { examDate, ...rest } = data;
        const paper = await Paper.create({
            ...rest,
            slug,
            examDate: examDate ? DateTime.fromISO(examDate) : null,
            questions: data.questions ?? [],
            totalQuestions: data.questions?.length ?? 0,
            status: data.status ?? 'pending',
        });
        return response.created(paper);
    }
    async update({ params, request, response }) {
        const paper = await Paper.find(params.id);
        if (!paper)
            return response.notFound({ message: 'Paper not found' });
        const data = await request.validateUsing(updateValidator);
        const bad = badAnswers(data.questions);
        if (bad.length) {
            return response.unprocessableEntity({ message: `Answer index out of range in question(s): ${bad.join(', ')}` });
        }
        const { examDate, questions, ...rest } = data;
        paper.merge(rest);
        if (examDate !== undefined)
            paper.examDate = examDate ? DateTime.fromISO(examDate) : null;
        if (questions) {
            paper.questions = questions;
            paper.totalQuestions = questions.length;
        }
        await paper.save();
        return response.ok(paper);
    }
    async destroy({ params, response }) {
        const paper = await Paper.find(params.id);
        if (!paper)
            return response.notFound({ message: 'Paper not found' });
        await paper.delete();
        return response.noContent();
    }
}
//# sourceMappingURL=admin_papers_controller.js.map