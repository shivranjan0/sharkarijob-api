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
    router.post('reviews', [ReviewsController, 'store']);
    const TwoFactorController = () => import('#controllers/two_factor_controller');
    router.group(() => {
        router.get('me', [AuthController, 'me']);
        router.post('logout', [AuthController, 'logout']);
        router.get('2fa', [TwoFactorController, 'status']);
        router.post('2fa/setup', [TwoFactorController, 'setup']);
        router.post('2fa/confirm', [TwoFactorController, 'confirm']);
        router.post('2fa/disable', [TwoFactorController, 'disable']);
    }).use(middleware.auth({ guards: ['api'] }));
    const AdminController = () => import('#controllers/admin_controller');
    const AdminPostsController = () => import('#controllers/admin_posts_controller');
    router
        .group(() => {
        router.get('categories', [AdminController, 'categories']);
        router.get('pages', [AdminController, 'pages']);
        router.get('reviews', [AdminController, 'reviews']);
        router.get('admins', [AdminController, 'admins']);
        router.get('subscribers', [AdminController, 'subscribers']);
        router.get('posts', [AdminPostsController, 'index']);
        router.post('posts', [AdminPostsController, 'store']);
        router.get('posts/:id', [AdminPostsController, 'show']);
        router.put('posts/:id', [AdminPostsController, 'update']).as('admin.posts.put');
        router.patch('posts/:id', [AdminPostsController, 'update']).as('admin.posts.patch');
        router.delete('posts/:id', [AdminPostsController, 'destroy']);
    })
        .prefix('admin')
        .use([middleware.auth({ guards: ['api'] }), middleware.admin()]);
    router.get(':slug', [PagesController, 'show']);
}).prefix('/api/v1');
//# sourceMappingURL=routes.js.map