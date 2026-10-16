import SocialMedia from '#models/social_media';
import Subscriber from '#models/subscriber';
import ContactMessage from '#models/contact_message';
import Mailer from '#services/mailer';
import vine from '@vinejs/vine';
const subscribeValidator = vine.compile(vine.object({
    email: vine.string().trim().email().maxLength(254),
}));
const contactValidator = vine.compile(vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email().maxLength(254),
    subject: vine.string().trim().maxLength(255).optional(),
    message: vine.string().trim().minLength(10).maxLength(5000),
}));
export default class SiteController {
    async socialMedia({ response }) {
        const links = await SocialMedia.query()
            .where('is_active', true)
            .orderBy('order', 'asc')
            .orderBy('id', 'asc');
        return response.ok({ data: links });
    }
    async contact({ request, response }) {
        const data = await request.validateUsing(contactValidator);
        const saved = await ContactMessage.create({
            name: data.name,
            email: data.email,
            subject: data.subject ?? null,
            message: data.message,
            isRead: false,
        });
        await Promise.all([
            Mailer.notifyContactMessage(saved),
            Mailer.acknowledgeContactMessage(saved),
        ]);
        return response.created({
            message: 'Thanks -- your message has reached us. We will reply by email.',
        });
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