import vine from '@vinejs/vine';
import db from '@adonisjs/lucid/services/db';
import Post from '#models/post';
import { safePage, safeLimit } from '#services/query_params';
const profileValidator = vine.compile(vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
}));
const passwordValidator = vine.compile(vine.object({
    currentPassword: vine.string(),
    newPassword: vine.string().minLength(8).maxLength(180),
}));
export default class AccountController {
    async overview({ auth, response }) {
        const user = auth.user;
        const [saved] = await db
            .from('saved_jobs')
            .where('user_id', user.id)
            .count('* as total');
        const [unread] = await db
            .from('notifications')
            .where('notifiable_id', user.id)
            .whereNull('read_at')
            .count('* as total');
        return response.ok({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            twoFactorEnabled: user.twoFactorEnabled,
            memberSince: user.createdAt,
            savedJobs: Number(saved?.total ?? 0),
            unreadNotifications: Number(unread?.total ?? 0),
        });
    }
    async updateProfile({ auth, request, response }) {
        const user = auth.user;
        const { name } = await request.validateUsing(profileValidator);
        user.name = name;
        await user.save();
        return response.ok({ message: 'Profile updated', name: user.name });
    }
    async changePassword({ auth, request, response }) {
        const user = auth.user;
        const { currentPassword, newPassword } = await request.validateUsing(passwordValidator);
        if (!(await user.verifyPassword(currentPassword))) {
            return response.unprocessableEntity({
                message: 'Your current password is not correct.',
            });
        }
        user.password = newPassword;
        await user.save();
        await user.revokeOtherAccessTokens();
        return response.ok({ message: 'Password changed. You have been signed out of your other sessions.' });
    }
    async savedJobs({ auth, request, response }) {
        const user = auth.user;
        const page = safePage(request.input('page', 1));
        const limit = safeLimit(request.input('limit', 20), 20, 50);
        const rows = await db
            .from('saved_jobs')
            .where('user_id', user.id)
            .orderBy('created_at', 'desc')
            .paginate(page, limit);
        const ids = rows.all().map((r) => r.post_id);
        const posts = ids.length
            ? await Post.query().whereIn('id', ids).preload('category')
            : [];
        const byId = new Map(posts.map((p) => [p.id, p]));
        return response.ok({
            meta: rows.getMeta(),
            data: rows.all().map((r) => {
                const post = byId.get(r.post_id);
                return {
                    savedAt: r.created_at,
                    post: post
                        ? {
                            id: post.id,
                            title: post.title,
                            slug: post.slug,
                            category: post.category?.name ?? null,
                            applicationEndDate: post.applicationEndDate,
                        }
                        : null,
                };
            }),
        });
    }
    async saveJob({ auth, params, response }) {
        const user = auth.user;
        const postId = Number(params.postId);
        const post = await Post.find(postId);
        if (!post)
            return response.notFound({ message: 'Post not found' });
        const existing = await db
            .from('saved_jobs')
            .where('user_id', user.id)
            .where('post_id', postId)
            .first();
        if (existing) {
            return response.ok({ message: 'Already saved', saved: true });
        }
        await db.table('saved_jobs').insert({
            user_id: user.id,
            post_id: postId,
            created_at: new Date(),
            updated_at: new Date(),
        });
        return response.created({ message: 'Job saved', saved: true });
    }
    async unsaveJob({ auth, params, response }) {
        const user = auth.user;
        await db
            .from('saved_jobs')
            .where('user_id', user.id)
            .where('post_id', Number(params.postId))
            .delete();
        return response.ok({ message: 'Removed', saved: false });
    }
    async notifications({ auth, request, response }) {
        const user = auth.user;
        const page = safePage(request.input('page', 1));
        const limit = safeLimit(request.input('limit', 20), 20, 50);
        const rows = await db
            .from('notifications')
            .where('notifiable_id', user.id)
            .orderBy('created_at', 'desc')
            .paginate(page, limit);
        return response.ok({
            meta: rows.getMeta(),
            data: rows.all().map((n) => ({
                id: n.id,
                type: n.type,
                data: typeof n.data === 'string' ? safeParse(n.data) : n.data,
                readAt: n.read_at,
                createdAt: n.created_at,
            })),
        });
    }
    async markNotificationsRead({ auth, response }) {
        const user = auth.user;
        const updated = await db
            .from('notifications')
            .where('notifiable_id', user.id)
            .whereNull('read_at')
            .update({ read_at: new Date() });
        return response.ok({ message: 'Marked as read', count: updated });
    }
}
function safeParse(value) {
    try {
        return JSON.parse(value);
    }
    catch {
        return value;
    }
}
//# sourceMappingURL=account_controller.js.map