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
    router.post('login', [AuthController, 'login']);
    router.post('login/2fa', [AuthController, 'loginTwoFactor']);
    const GoogleAuthController = () => import('#controllers/google_auth_controller');
    router.get('auth/google/redirect', [GoogleAuthController, 'redirect']);
    router.get('auth/google/callback', [GoogleAuthController, 'callback']);
    router.post('register', [AuthController, 'register']);
    router.get('home', [PostsController, 'homeData']);
    router.get('posts', [PostsController, 'index']);
    router.get('posts/:slug', [PostsController, 'show']);
    router.get('pages', [PagesController, 'index']);
    router.get('social-media', [SiteController, 'socialMedia']);
    router.post('subscribe', [SiteController, 'subscribe']);
    router.get('blogs', [BlogsController, 'index']);
    router.get('blog-categories', [BlogsController, 'categories']);
    router.get('blogs/:slug', [BlogsController, 'show']);
    router.get('reviews', [ReviewsController, 'index']);
    router.post('reviews', [ReviewsController, 'store']);
    const TwoFactorController = () => import('#controllers/two_factor_controller');
    router.group(() => {
        router.get('me', [AuthController, 'me']);
        router.post('logout', [AuthController, 'logout']);
        const AccountController = () => import('#controllers/account_controller');
        router.get('account', [AccountController, 'overview']);
        router.put('account', [AccountController, 'updateProfile']);
        router.post('account/password', [AccountController, 'changePassword']);
        router.get('account/saved-jobs', [AccountController, 'savedJobs']);
        router.post('account/saved-jobs/:postId', [AccountController, 'saveJob']);
        router.delete('account/saved-jobs/:postId', [AccountController, 'unsaveJob']);
        router.get('account/notifications', [AccountController, 'notifications']);
        router.post('account/notifications/read', [AccountController, 'markNotificationsRead']);
        router.get('2fa', [TwoFactorController, 'status']);
        router.post('2fa/setup', [TwoFactorController, 'setup']);
        router.post('2fa/confirm', [TwoFactorController, 'confirm']);
        router.post('2fa/disable', [TwoFactorController, 'disable']);
    }).use(middleware.auth({ guards: ['api'] }));
    const AdminController = () => import('#controllers/admin_controller');
    const AdminPostsController = () => import('#controllers/admin_posts_controller');
    const AdminBlogsController = () => import('#controllers/admin_blogs_controller');
    const AdminResourcesController = () => import('#controllers/admin_resources_controller');
    router
        .group(() => {
        router.get('reviews', [AdminController, 'reviews']);
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
        .use([middleware.auth({ guards: ['api'] }), middleware.admin()]);
    router.get(':slug', [PagesController, 'show']);
}).prefix('/api/v1');
//# sourceMappingURL=routes.js.map