import Page from '#models/page';
export default class PagesController {
    async index({ response }) {
        const pages = await Page.query().select('id', 'slug', 'title').orderBy('id', 'asc');
        return response.ok({ data: pages });
    }
    async show({ params, response }) {
        const slug = params.slug;
        const page = await Page.findByOrFail('slug', slug);
        return response.ok({
            data: page
        });
    }
}
//# sourceMappingURL=pages_controller.js.map