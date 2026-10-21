import vine from '@vinejs/vine';
import PushService from '#services/push_service';
const subscribeValidator = vine.compile(vine.object({
    endpoint: vine.string().trim().url().maxLength(1024),
    contentEncoding: vine.string().trim().maxLength(30).optional(),
    keys: vine.object({
        p256dh: vine.string().trim().maxLength(255),
        auth: vine.string().trim().maxLength(255),
    }),
}));
const unsubscribeValidator = vine.compile(vine.object({
    endpoint: vine.string().trim().url().maxLength(1024),
}));
export default class PushController {
    async publicKey({ response }) {
        if (!PushService.enabled)
            return response.serviceUnavailable({ message: 'Push is not configured' });
        return response.ok({ publicKey: PushService.publicKey });
    }
    async subscribe({ request, response }) {
        if (!PushService.enabled)
            return response.serviceUnavailable({ message: 'Push is not configured' });
        const data = await request.validateUsing(subscribeValidator);
        await PushService.subscribe(data, null);
        return response.created({ message: 'Notifications enabled' });
    }
    async unsubscribe({ request, response }) {
        const { endpoint } = await request.validateUsing(unsubscribeValidator);
        await PushService.unsubscribe(endpoint);
        return response.ok({ message: 'Notifications disabled' });
    }
}
