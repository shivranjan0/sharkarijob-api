import Paper from '#models/paper';
const LIST_COLUMNS = [
    'id',
    'slug',
    'exam',
    'exam_name',
    'year',
    'shift',
    'exam_date',
    'total_questions',
    'updated_at',
];
export default class PapersController {
    async index({ request, response }) {
        const query = Paper.query().select(LIST_COLUMNS).where('status', 'approved');
        const exam = String(request.input('exam', '')).trim();
        if (exam)
            query.where('exam', exam);
        const papers = await query.orderBy('year', 'desc').orderBy('id', 'desc').limit(500);
        return response.ok({ data: papers });
    }
    async show({ params, response }) {
        const paper = await Paper.query().where('slug', params.slug).where('status', 'approved').first();
        if (!paper)
            return response.notFound({ message: 'Paper not found' });
        return response.ok({ data: paper.serialize() });
    }
    async topic({ params, response }) {
        const papers = await Paper.query().where('exam', params.exam).where('status', 'approved').orderBy('year', 'desc');
        if (papers.length === 0)
            return response.notFound({ message: 'Exam not found' });
        const topic = String(params.topic).toLowerCase();
        const questions = papers.flatMap((p) => (p.questions ?? [])
            .filter((q) => String(q.topic).toLowerCase() === topic)
            .map((q) => ({ ...q, paperSlug: p.slug, paperLabel: `${p.examName} ${p.year}${p.shift ? ` ${p.shift}` : ''}` })));
        if (questions.length === 0)
            return response.notFound({ message: 'No questions for this topic' });
        return response.ok({ data: { exam: params.exam, examName: papers[0].examName, topic, questions } });
    }
}
//# sourceMappingURL=papers_controller.js.map