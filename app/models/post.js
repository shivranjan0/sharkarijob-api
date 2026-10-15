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
// The legacy rows were scraped from a competitor, and the scrape kept that
// page's furniture: a leading "Name of Post:" label, a "Post Date: ..."
// stamp, and in two cases the competitor's own brand sitting in the title.
// Those strings are what Google shows as the title and snippet, so they are
// stripped on read rather than left for a manual pass over 717 rows.
//
// Applied via the column's `consume` hook so every consumer -- the listing,
// the single-post endpoint, the sitemap, the RSS feed and the edge worker --
// sees the same cleaned value.
function cleanTitle(value) {
    if (!value)
        return value;
    return String(value)
        .replace(/^\s*name of post\s*:\s*/i, '')
        .replace(/\s*\|\s*sarkari\s*result\s*$/i, '')
        .replace(/\s*-\s*sarkari\s*result\s*$/i, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
}
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
        // The two rewrites above only match the site root and a single path
        // segment. A deeper link -- /wp-content/uploads/2026/06/notice.pdf --
        // fell through to the brand-stripping below, which deleted the domain
        // from the middle of the URL and left "http:///wp-content/...": a link
        // with no host at all. Around 39% of posts carried at least one, and
        // they render as dead links on the page.
        //
        // Anything still pointing at the source site is a deep link to their
        // files, which should not be hot-linked anyway. Drop the anchor and
        // keep the text it wrapped.
        value = value.replace(/<a[^>]*href=["'][^"']*sarkariresult[^"']*["'][^>]*>([\s\S]*?)<\/a>/gis, '$1');
        // Bare URLs outside an anchor, so the brand-stripping cannot maul them.
        value = value.replace(/https?:\/\/(?:www\.)?sarkariresult\.com(?:\.cm)?[^\s"'<>]*/gis, '');
        value = value.replace(/SarkariResult\.com\.cm/gi, '');
        value = value.replace(/SarkariResult\.com/gi, '');
        value = value.replace(/SarkariResult/gi, '');
        // Safety net for anything that still ended up host-less, including
        // rows where the damage was saved into the stored content.
        value = value.replace(/<a[^>]*href=["']https?:\/\/\/[^"']*["'][^>]*>([\s\S]*?)<\/a>/gis, '$1');
        // Where the link text was the brand itself, stripping it leaves an
        // empty anchor -- a clickable nothing. Remove the element too.
        value = value.replace(/<a\b[^>]*>(\s|&nbsp;)*<\/a>/gis, '');
        // Same scrape furniture inside the body. The "Post Date:" stamp is
        // the competitor's publish time, not ours, and it was landing at the
        // top of every generated meta description.
        value = value.replace(/Name of Post\s*:\s*/gi, '');
        // The stamp is not plain text -- it ships inside the competitor's
        // own markup, as `<p class="gb-headline">Post Date: <time ...>Feb
        // 27, 2024</time></p>` with the clock time in a separate span. So
        // the elements go, not just the words.
        value = value.replace(/<p[^>]*>\s*Post Date\s*:[\s\S]*?<\/p>/gi, '');
        value = value.replace(/<span[^>]*class=["'][^"']*custom-post-time[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, '');
        value = value.replace(/Post Date\s*:\s*[A-Za-z]+ \d{1,2},? \d{4}(,? ?\d{1,2}:\d{2}\s*(?:am|pm))?/gi, '');
        value = value.replace(/\|\s*Sarkari\s*Result/gi, '');
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
    column({ consume: cleanTitle }),
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
//# sourceMappingURL=post.js.map