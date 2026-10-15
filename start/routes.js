import { middleware } from '#start/kernel';
import router from '@adonisjs/core/services/router';
const AuthController = () => import('#controllers/auth_controller');
const PagesController = () => import('#controllers/pages_controller');
const ReviewsController = () => import('#controllers/reviews_controller');
const PostsController = () => import('#controllers/posts_controller');
const BlogsController = () => import('#controllers/blogs_controller');
const SeoController = () => import('#controllers/seo_controller');
const SiteController = () => import('#controllers/site_controller');
router.get('/', () => {
    return { status: 'Adonis API is running' };
});
router.get('/sitemap.xml', [SeoController, 'sitemap']);
router.get('/feed', [SeoController, 'feed']);
router.group(() => {
    router.post('login', [AuthController, 'login']).use([
        // Per-address: stops one account being hammered.
        middleware.rateLimit({
            scope: 'login',
            max: 10,
            windowMs: 15 * 60 * 1000,
            key: (ctx) => String(ctx.request.input('email', '')).trim().toLowerCase(),
        }),
        // Per-caller ceiling on top. Without it, one password can be sprayed
        // across unlimited addresses -- each new address is a fresh bucket --
        // and every attempt costs a bcrypt-cost-12 verification even for an
        // address that does not exist, so the spray doubles as a CPU drain.
        middleware.rateLimit({ scope: 'login-ip', max: 40, windowMs: 15 * 60 * 1000 }),
    ]);
    router.post('login/2fa', [AuthController, 'loginTwoFactor']).use([
        middleware.rateLimit({
            scope: 'login-2fa',
            max: 10,
            windowMs: 15 * 60 * 1000,
            key: (ctx) => String(ctx.request.input('challenge', '')),
        }),
        // A fresh challenge is a fresh bucket, so cap the caller too.
        middleware.rateLimit({ scope: 'login-2fa-ip', max: 40, windowMs: 15 * 60 * 1000 }),
    ]);
    const GoogleAuthController = () => import('#controllers/google_auth_controller');
    router.get('auth/google/redirect', [GoogleAuthController, 'redirect']);
    router.get('auth/google/callback', [GoogleAuthController, 'callback']);
    router.post('register', [AuthController, 'register']).use(middleware.rateLimit({
        scope: 'register',
        max: 5,
        windowMs: 60 * 60 * 1000,
    }));
    router.get('home', [PostsController, 'homeData']);
    router.get('posts', [PostsController, 'index']);
    router.get('posts/:slug', [PostsController, 'show']);
    router.get('pages', [PagesController, 'index']);
    router.get('social-media', [SiteController, 'socialMedia']);
    router.post('subscribe', [SiteController, 'subscribe']).use(middleware.rateLimit({
        scope: 'subscribe',
        max: 10,
        windowMs: 60 * 60 * 1000,
    }));
    router.get('blogs', [BlogsController, 'index']);
    router.get('blog-categories', [BlogsController, 'categories']);
    router.get('blogs/:slug', [BlogsController, 'show']);
    router.get('reviews', [ReviewsController, 'index']);
    router.post('reviews', [ReviewsController, 'store']).use(middleware.rateLimit({
        scope: 'reviews',
        max: 5,
        windowMs: 60 * 60 * 1000,
    }));
    const TwoFactorController = () => import('#controllers/two_factor_controller');
    router.group(() => {
        router.get('me', [AuthController, 'me']);
        router.post('logout', [AuthController, 'logout']);
        const AccountController = () => import('#controllers/account_controller');
        router.get('account', [AccountController, 'overview']);
        router.put('account', [AccountController, 'updateProfile']);
        router.post('account/password', [AccountController, 'changePassword']).use(middleware.rateLimit({
            scope: 'password-change',
            max: 10,
            windowMs: 15 * 60 * 1000,
            perIp: false,
            key: (ctx) => String(ctx.auth?.user?.id ?? ''),
        }));
        router.get('account/saved-jobs', [AccountController, 'savedJobs']);
        router.post('account/saved-jobs/:postId', [AccountController, 'saveJob']);
        router.delete('account/saved-jobs/:postId', [AccountController, 'unsaveJob']);
        router.get('account/notifications', [AccountController, 'notifications']);
        router.post('account/notifications/read', [AccountController, 'markNotificationsRead']);
        router.get('2fa', [TwoFactorController, 'status']);
        router.post('2fa/setup', [TwoFactorController, 'setup']);
        // These sit behind `auth`, so key them on the account rather
        // than the address: an IP-only bucket here is shared by every signed-in
        // user behind the same NAT or CDN edge, which locks out bystanders
        // instead of the one account being attacked.
        router.post('2fa/confirm', [TwoFactorController, 'confirm']).use(middleware.rateLimit({
            scope: '2fa-confirm',
            max: 10,
            windowMs: 15 * 60 * 1000,
            perIp: false,
            key: (ctx) => String(ctx.auth?.user?.id ?? ''),
        }));
        router.post('2fa/disable', [TwoFactorController, 'disable']).use(middleware.rateLimit({
            scope: '2fa-disable',
            max: 10,
            windowMs: 15 * 60 * 1000,
            perIp: false,
            key: (ctx) => String(ctx.auth?.user?.id ?? ''),
        }));
    }).use([middleware.auth({ guards: ['api'] }), middleware.noStore()]);
    const AdminController = () => import('#controllers/admin_controller');
    const AdminPostsController = () => import('#controllers/admin_posts_controller');
    const AdminBlogsController = () => import('#controllers/admin_blogs_controller');
    const AdminResourcesController = () => import('#controllers/admin_resources_controller');
    router
        .group(() => {
        router.get('reviews', [AdminController, 'reviews']);
        router.put('reviews/:id', [AdminController, 'updateReviewStatus']).as('admin.reviews.put');
        router.delete('reviews/:id', [AdminController, 'destroyReview']);
        router.get('admins', [AdminController, 'admins']);
        router.get('dashboard', [AdminResourcesController, 'dashboard']);
        router.get('blogs', [AdminBlogsController, 'index']);
        router.post('blogs', [AdminBlogsController, 'store']);
        router.get('blogs/:id', [AdminBlogsController, 'show']);
        router.put('blogs/:id', [AdminBlogsController, 'update']).as('admin.blogs.put');
        router.delete('blogs/:id', [AdminBlogsController, 'destroy']);
        router.get('posts', [AdminPostsController, 'index']);
        router.post('posts', [AdminPostsController, 'store']);
        router.get('posts/:id', [AdminPostsController, 'show']);
        router.put('posts/:id', [AdminPostsController, 'update']).as('admin.posts.put');
        router.patch('posts/:id', [AdminPostsController, 'update']).as('admin.posts.patch');
        router.delete('posts/:id', [AdminPostsController, 'destroy']);
        router.get(':resource', [AdminResourcesController, 'index']);
        router.post(':resource', [AdminResourcesController, 'store']);
        router.get(':resource/:id', [AdminResourcesController, 'show']);
        router.put(':resource/:id', [AdminResourcesController, 'update']).as('admin.res.put');
        router.delete(':resource/:id', [AdminResourcesController, 'destroy']);
    })
        .prefix('admin')
        .use([middleware.auth({ guards: ['api'] }), middleware.admin(), middleware.noStore()]);
    router.get(':slug', [PagesController, 'show']);
}).prefix('/api/v1');
//# sourceMappingURL=routes.js.map