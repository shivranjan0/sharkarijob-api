import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'seo.sitemap': { paramsTuple?: []; params?: {} }
    'seo.feed': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.login_two_factor': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'posts.home_data': { paramsTuple?: []; params?: {} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'pages.index': { paramsTuple?: []; params?: {} }
    'site.social_media': { paramsTuple?: []; params?: {} }
    'site.subscribe': { paramsTuple?: []; params?: {} }
    'blogs.index': { paramsTuple?: []; params?: {} }
    'blogs.categories': { paramsTuple?: []; params?: {} }
    'blogs.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'reviews.store': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'two_factor.status': { paramsTuple?: []; params?: {} }
    'two_factor.setup': { paramsTuple?: []; params?: {} }
    'two_factor.confirm': { paramsTuple?: []; params?: {} }
    'two_factor.disable': { paramsTuple?: []; params?: {} }
    'admin.categories': { paramsTuple?: []; params?: {} }
    'admin.pages': { paramsTuple?: []; params?: {} }
    'admin.reviews': { paramsTuple?: []; params?: {} }
    'admin.admins': { paramsTuple?: []; params?: {} }
    'admin.subscribers': { paramsTuple?: []; params?: {} }
    'admin_posts.index': { paramsTuple?: []; params?: {} }
    'admin_posts.store': { paramsTuple?: []; params?: {} }
    'admin_posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.put': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.posts.patch': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin_posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pages.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  GET: {
    'seo.sitemap': { paramsTuple?: []; params?: {} }
    'seo.feed': { paramsTuple?: []; params?: {} }
    'posts.home_data': { paramsTuple?: []; params?: {} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'pages.index': { paramsTuple?: []; params?: {} }
    'site.social_media': { paramsTuple?: []; params?: {} }
    'blogs.index': { paramsTuple?: []; params?: {} }
    'blogs.categories': { paramsTuple?: []; params?: {} }
    'blogs.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'two_factor.status': { paramsTuple?: []; params?: {} }
    'admin.categories': { paramsTuple?: []; params?: {} }
    'admin.pages': { paramsTuple?: []; params?: {} }
    'admin.reviews': { paramsTuple?: []; params?: {} }
    'admin.admins': { paramsTuple?: []; params?: {} }
    'admin.subscribers': { paramsTuple?: []; params?: {} }
    'admin_posts.index': { paramsTuple?: []; params?: {} }
    'admin_posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pages.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  HEAD: {
    'seo.sitemap': { paramsTuple?: []; params?: {} }
    'seo.feed': { paramsTuple?: []; params?: {} }
    'posts.home_data': { paramsTuple?: []; params?: {} }
    'posts.index': { paramsTuple?: []; params?: {} }
    'posts.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'pages.index': { paramsTuple?: []; params?: {} }
    'site.social_media': { paramsTuple?: []; params?: {} }
    'blogs.index': { paramsTuple?: []; params?: {} }
    'blogs.categories': { paramsTuple?: []; params?: {} }
    'blogs.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'two_factor.status': { paramsTuple?: []; params?: {} }
    'admin.categories': { paramsTuple?: []; params?: {} }
    'admin.pages': { paramsTuple?: []; params?: {} }
    'admin.reviews': { paramsTuple?: []; params?: {} }
    'admin.admins': { paramsTuple?: []; params?: {} }
    'admin.subscribers': { paramsTuple?: []; params?: {} }
    'admin_posts.index': { paramsTuple?: []; params?: {} }
    'admin_posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pages.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  POST: {
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.login_two_factor': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'site.subscribe': { paramsTuple?: []; params?: {} }
    'reviews.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'two_factor.setup': { paramsTuple?: []; params?: {} }
    'two_factor.confirm': { paramsTuple?: []; params?: {} }
    'two_factor.disable': { paramsTuple?: []; params?: {} }
    'admin_posts.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'admin.posts.put': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'admin.posts.patch': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'admin_posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}