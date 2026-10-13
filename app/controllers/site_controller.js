import SocialMedia from '#models/social_media';
import Subscriber from '#models/subscriber';
import vine from '@vinejs/vine';
const subscribeValidator = vine.compile(vine.object({
    email: vine.string().trim().email().maxLength(254),
}));
export default class SiteController {
    async socialMedia({ response }) {
        const links = await SocialMedia.query()
            .where('is_active', true)
            .orderBy('order', 'asc')
            .orderBy('id', 'asc');
        return response.ok({ data: links });
    }
    async subscribe({ request, response }) {
        const { email } = await request.validateUsing(subscribeValidator);
        const existing = await Subscriber.findBy('email', email);
        if (!existing) {
            await Subscriber.create({ email });
        }
        return response.ok({ message: 'Thanks — you are subscribed.' });
    }
}
//# sourceMappingURL=site_controller.js.map