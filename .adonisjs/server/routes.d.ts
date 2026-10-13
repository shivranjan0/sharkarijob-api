import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'seo.sitemap': { paramsTuple?: []; params?: {} }
    'seo.feed': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
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
    'admin.categories': { paramsTuple?: []; params?: {} }
    'admin.pages': { paramsTuple?: []; params?: {} }
    'admin.reviews': { paramsTuple?: []; params?: {} }
    'admin.admins': { paramsTuple?: []; params?: {} }
    'admin.subscribers': { paramsTuple?: []; params?: {} }
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
    'admin.categories': { paramsTuple?: []; params?: {} }
    'admin.pages': { paramsTuple?: []; params?: {} }
    'admin.reviews': { paramsTuple?: []; params?: {} }
    'admin.admins': { paramsTuple?: []; params?: {} }
    'admin.subscribers': { paramsTuple?: []; params?: {} }
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
    'admin.categories': { paramsTuple?: []; params?: {} }
    'admin.pages': { paramsTuple?: []; params?: {} }
    'admin.reviews': { paramsTuple?: []; params?: {} }
    'admin.admins': { paramsTuple?: []; params?: {} }
    'admin.subscribers': { paramsTuple?: []; params?: {} }
    'pages.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  POST: {
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.register': { paramsTuple?: []; params?: {} }
    'site.subscribe': { paramsTuple?: []; params?: {} }
    'reviews.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}