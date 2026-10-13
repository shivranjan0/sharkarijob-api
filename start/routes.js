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
    router.group(() => {
        router.get('me', [AuthController, 'me']);
        router.post('logout', [AuthController, 'logout']);
    }).use(middleware.auth({ guards: ['api'] }));
    const AdminController = () => import('#controllers/admin_controller');
    router.get('admin/categories', [AdminController, 'categories']);
    router.get('admin/pages', [AdminController, 'pages']);
    router.get('admin/reviews', [AdminController, 'reviews']);
    router.get('admin/admins', [AdminController, 'admins']);
    router.get('admin/subscribers', [AdminController, 'subscribers']);
    router.get(':slug', [PagesController, 'show']);
}).prefix('/api/v1');
//# sourceMappingURL=routes.js.map