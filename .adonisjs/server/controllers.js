export const controllers = {
    AccessTokens: () => import('#controllers/access_tokens_controller'),
    Admin: () => import('#controllers/admin_controller'),
    AdminPosts: () => import('#controllers/admin_posts_controller'),
    Auth: () => import('#controllers/auth_controller'),
    Blogs: () => import('#controllers/blogs_controller'),
    NewAccount: () => import('#controllers/new_account_controller'),
    Pages: () => import('#controllers/pages_controller'),
    Posts: () => import('#controllers/posts_controller'),
    Profile: () => import('#controllers/profile_controller'),
    Reviews: () => import('#controllers/reviews_controller'),
    Seo: () => import('#controllers/seo_controller'),
    Site: () => import('#controllers/site_controller'),
    TwoFactor: () => import('#controllers/two_factor_controller'),
};
//# sourceMappingURL=controllers.js.map