var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DateTime } from 'luxon';
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm';
import PostDate from '#models/post_date';
import PostFee from '#models/post_fee';
import PostVacancy from '#models/post_vacancy';
import Media from '#models/media';
import Category from '#models/category';
export default class Post extends BaseModel {
    get cleanContent() {
        let value = this.content;
        if (!value)
            return value;
        value = value.replace(/<a[^>]*href=["'][^"']*(?:whatsapp|t\.me|telegram)[^"']*["'][^>]*>.*?<\/a>/gis, '');
        value = value.replace(/<a[^>]*href=["'][^"']*(?:play\.google\.com|apps\.apple\.com)[^"']*["'][^>]*>.*?<\/a>/gis, '');
        value = value.replace(/<img[^>]*src=["'][^"']*sarkariresult[^"']*["'][^>]*>/gis, '');
        value = value.replace(/href=["']https?:\/\/(?:www\.)?sarkariresult\.com(?:\.cm)?\/?["']/gis, 'href="/"');
        value = value.replace(/href=["']https?:\/\/(?:www\.)?sarkariresult\.com(?:\.cm)?\/([^\/]+)\/?["']/gis, 'href="/latest-job-details/$1"');
        value = value.replace(/SarkariResult\.com\.cm/gi, '');
        value = value.replace(/SarkariResult\.com/gi, '');
        value = value.replace(/SarkariResult/gi, '');
        return value;
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "categoryId", void 0);
__decorate([
    belongsTo(() => Category),
    __metadata("design:type", Object)
], Post.prototype, "category", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Post.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "shortDescription", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "content", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "thumbnail", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "banner", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Post.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Post.prototype, "views", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Post.prototype, "isFeatured", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Post.prototype, "isTrending", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], Post.prototype, "isLive", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "metaTitle", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "metaDescription", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "metaKeywords", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "schemaJson", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "organization", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "location", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "totalPosts", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], Post.prototype, "applicationStartDate", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], Post.prototype, "applicationEndDate", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], Post.prototype, "examDate", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "applyOnlineUrl", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "officialNotificationUrl", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Post.prototype, "officialWebsiteUrl", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Post.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Post.prototype, "updatedAt", void 0);
__decorate([
    hasMany(() => PostDate),
    __metadata("design:type", Object)
], Post.prototype, "dates", void 0);
__decorate([
    hasMany(() => PostFee),
    __metadata("design:type", Object)
], Post.prototype, "fees", void 0);
__decorate([
    hasMany(() => PostVacancy),
    __metadata("design:type", Object)
], Post.prototype, "vacancies", void 0);
__decorate([
    hasMany(() => Media, {
        foreignKey: 'modelId',
        onQuery: (query) => {
            query.where('model_type', 'App\\Models\\Post');
        }
    }),
    __metadata("design:type", Object)
], Post.prototype, "media", void 0);
Post.before('save', (post) => {
    post.$extras.announce = post.status === 'published' && (post.$isLocal || post.$original?.status !== 'published');
});
Post.after('save', async (post) => {
    if (!post.$extras.announce)
        return;
    post.$extras.announce = false;
    const { default: PushService } = await import('#services/push_service');
    void PushService.notifyPost(post);
});
//# sourceMappingURL=post.js.map