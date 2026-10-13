var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseModel, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
export class AdminSchema extends BaseModel {
    static $columns = ['avatar', 'createdAt', 'email', 'id', 'name', 'password', 'phone', 'rememberToken', 'updatedAt'];
    $columns = AdminSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], AdminSchema.prototype, "avatar", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], AdminSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AdminSchema.prototype, "email", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], AdminSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AdminSchema.prototype, "name", void 0);
__decorate([
    column({ serializeAs: null }),
    __metadata("design:type", String)
], AdminSchema.prototype, "password", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdminSchema.prototype, "phone", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdminSchema.prototype, "rememberToken", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], AdminSchema.prototype, "updatedAt", void 0);
export class AdmissionSchema extends BaseModel {
    static $columns = ['createdAt', 'details', 'icon', 'id', 'meta', 'slug', 'tag', 'title', 'updatedAt', 'url'];
    $columns = AdmissionSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], AdmissionSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdmissionSchema.prototype, "details", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdmissionSchema.prototype, "icon", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], AdmissionSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdmissionSchema.prototype, "meta", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AdmissionSchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdmissionSchema.prototype, "tag", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AdmissionSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], AdmissionSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdmissionSchema.prototype, "url", void 0);
export class AdmitCardSchema extends BaseModel {
    static $columns = ['createdAt', 'details', 'icon', 'id', 'meta', 'slug', 'tag', 'title', 'updatedAt', 'url'];
    $columns = AdmitCardSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], AdmitCardSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdmitCardSchema.prototype, "details", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdmitCardSchema.prototype, "icon", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], AdmitCardSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdmitCardSchema.prototype, "meta", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdmitCardSchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdmitCardSchema.prototype, "tag", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AdmitCardSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], AdmitCardSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AdmitCardSchema.prototype, "url", void 0);
export class AnswerKeySchema extends BaseModel {
    static $columns = ['createdAt', 'details', 'icon', 'id', 'meta', 'slug', 'tag', 'title', 'updatedAt', 'url'];
    $columns = AnswerKeySchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], AnswerKeySchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AnswerKeySchema.prototype, "details", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AnswerKeySchema.prototype, "icon", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], AnswerKeySchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AnswerKeySchema.prototype, "meta", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AnswerKeySchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AnswerKeySchema.prototype, "tag", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AnswerKeySchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], AnswerKeySchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AnswerKeySchema.prototype, "url", void 0);
export class AuthAccessTokenSchema extends BaseModel {
    static $columns = ['abilities', 'createdAt', 'expiresAt', 'hash', 'id', 'lastUsedAt', 'name', 'tokenableId', 'type', 'updatedAt'];
    $columns = AuthAccessTokenSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", String)
], AuthAccessTokenSchema.prototype, "abilities", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], AuthAccessTokenSchema.prototype, "createdAt", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], AuthAccessTokenSchema.prototype, "expiresAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AuthAccessTokenSchema.prototype, "hash", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], AuthAccessTokenSchema.prototype, "id", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], AuthAccessTokenSchema.prototype, "lastUsedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuthAccessTokenSchema.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AuthAccessTokenSchema.prototype, "tokenableId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AuthAccessTokenSchema.prototype, "type", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], AuthAccessTokenSchema.prototype, "updatedAt", void 0);
export class BlogSchema extends BaseModel {
    static $columns = ['category', 'content', 'createdAt', 'description', 'id', 'image', 'isFeatured', 'metaDescription', 'metaKeywords', 'metaTitle', 'slug', 'status', 'tableOfContents', 'title', 'updatedAt'];
    $columns = BlogSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", String)
], BlogSchema.prototype, "category", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], BlogSchema.prototype, "content", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], BlogSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], BlogSchema.prototype, "description", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], BlogSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], BlogSchema.prototype, "image", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], BlogSchema.prototype, "isFeatured", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], BlogSchema.prototype, "metaDescription", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], BlogSchema.prototype, "metaKeywords", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], BlogSchema.prototype, "metaTitle", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], BlogSchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], BlogSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], BlogSchema.prototype, "tableOfContents", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], BlogSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], BlogSchema.prototype, "updatedAt", void 0);
export class BlogCategorySchema extends BaseModel {
    static $columns = ['createdAt', 'id', 'name', 'order', 'slug', 'status', 'updatedAt'];
    $columns = BlogCategorySchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], BlogCategorySchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], BlogCategorySchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], BlogCategorySchema.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], BlogCategorySchema.prototype, "order", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], BlogCategorySchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], BlogCategorySchema.prototype, "status", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], BlogCategorySchema.prototype, "updatedAt", void 0);
export class CacheSchema extends BaseModel {
    static $columns = ['expiration', 'key', 'value'];
    $columns = CacheSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Number)
], CacheSchema.prototype, "expiration", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", String)
], CacheSchema.prototype, "key", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], CacheSchema.prototype, "value", void 0);
export class CacheLockSchema extends BaseModel {
    static $columns = ['expiration', 'key', 'owner'];
    $columns = CacheLockSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Number)
], CacheLockSchema.prototype, "expiration", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", String)
], CacheLockSchema.prototype, "key", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], CacheLockSchema.prototype, "owner", void 0);
export class CategorySchema extends BaseModel {
    static $columns = ['createdAt', 'id', 'name', 'order', 'slug', 'status', 'updatedAt'];
    $columns = CategorySchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], CategorySchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], CategorySchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], CategorySchema.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], CategorySchema.prototype, "order", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], CategorySchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], CategorySchema.prototype, "status", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], CategorySchema.prototype, "updatedAt", void 0);
export class ContactMessageSchema extends BaseModel {
    static $columns = ['attachment', 'createdAt', 'email', 'id', 'isRead', 'message', 'name', 'subject', 'updatedAt'];
    $columns = ContactMessageSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], ContactMessageSchema.prototype, "attachment", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], ContactMessageSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ContactMessageSchema.prototype, "email", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], ContactMessageSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], ContactMessageSchema.prototype, "isRead", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ContactMessageSchema.prototype, "message", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ContactMessageSchema.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ContactMessageSchema.prototype, "subject", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], ContactMessageSchema.prototype, "updatedAt", void 0);
export class DocumentSchema extends BaseModel {
    static $columns = ['createdAt', 'details', 'icon', 'id', 'meta', 'slug', 'tag', 'title', 'updatedAt', 'url'];
    $columns = DocumentSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], DocumentSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], DocumentSchema.prototype, "details", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], DocumentSchema.prototype, "icon", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], DocumentSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], DocumentSchema.prototype, "meta", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], DocumentSchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], DocumentSchema.prototype, "tag", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], DocumentSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], DocumentSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], DocumentSchema.prototype, "url", void 0);
export class FailedJobSchema extends BaseModel {
    static $columns = ['connection', 'exception', 'failedAt', 'id', 'payload', 'queue', 'uuid'];
    $columns = FailedJobSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", String)
], FailedJobSchema.prototype, "connection", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FailedJobSchema.prototype, "exception", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", DateTime)
], FailedJobSchema.prototype, "failedAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], FailedJobSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FailedJobSchema.prototype, "payload", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FailedJobSchema.prototype, "queue", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], FailedJobSchema.prototype, "uuid", void 0);
export class GovJobSchema extends BaseModel {
    static $columns = ['applicationEndDate', 'applicationStartDate', 'applyOnlineUrl', 'category', 'createdAt', 'department', 'description', 'examDate', 'id', 'isFeatured', 'location', 'officialNotificationUrl', 'organization', 'status', 'title', 'totalPosts', 'updatedAt'];
    $columns = GovJobSchema.$columns;
}
__decorate([
    column.date(),
    __metadata("design:type", Object)
], GovJobSchema.prototype, "applicationEndDate", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], GovJobSchema.prototype, "applicationStartDate", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], GovJobSchema.prototype, "applyOnlineUrl", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], GovJobSchema.prototype, "category", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], GovJobSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], GovJobSchema.prototype, "department", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], GovJobSchema.prototype, "description", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], GovJobSchema.prototype, "examDate", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], GovJobSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], GovJobSchema.prototype, "isFeatured", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], GovJobSchema.prototype, "location", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], GovJobSchema.prototype, "officialNotificationUrl", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], GovJobSchema.prototype, "organization", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], GovJobSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], GovJobSchema.prototype, "title", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], GovJobSchema.prototype, "totalPosts", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], GovJobSchema.prototype, "updatedAt", void 0);
export class HomepageSectionSchema extends BaseModel {
    static $columns = ['createdAt', 'id', 'isEnabled', 'postLimit', 'sectionKey', 'sortBy', 'title', 'updatedAt'];
    $columns = HomepageSectionSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], HomepageSectionSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], HomepageSectionSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], HomepageSectionSchema.prototype, "isEnabled", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], HomepageSectionSchema.prototype, "postLimit", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], HomepageSectionSchema.prototype, "sectionKey", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], HomepageSectionSchema.prototype, "sortBy", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], HomepageSectionSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], HomepageSectionSchema.prototype, "updatedAt", void 0);
export class JobSchema extends BaseModel {
    static $columns = ['attempts', 'availableAt', 'createdAt', 'id', 'payload', 'queue', 'reservedAt'];
    $columns = JobSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Boolean)
], JobSchema.prototype, "attempts", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], JobSchema.prototype, "availableAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], JobSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], JobSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], JobSchema.prototype, "payload", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], JobSchema.prototype, "queue", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], JobSchema.prototype, "reservedAt", void 0);
export class JobBatchSchema extends BaseModel {
    static $columns = ['cancelledAt', 'createdAt', 'failedJobIds', 'failedJobs', 'finishedAt', 'id', 'name', 'options', 'pendingJobs', 'totalJobs'];
    $columns = JobBatchSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], JobBatchSchema.prototype, "cancelledAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], JobBatchSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], JobBatchSchema.prototype, "failedJobIds", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], JobBatchSchema.prototype, "failedJobs", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], JobBatchSchema.prototype, "finishedAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", String)
], JobBatchSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], JobBatchSchema.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], JobBatchSchema.prototype, "options", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], JobBatchSchema.prototype, "pendingJobs", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], JobBatchSchema.prototype, "totalJobs", void 0);
export class LatestJobSchema extends BaseModel {
    static $columns = ['applicationEndDate', 'applicationStartDate', 'applyOnlineUrl', 'category', 'createdAt', 'description', 'details', 'examDate', 'icon', 'id', 'location', 'meta', 'officialNotificationUrl', 'officialWebsiteUrl', 'organization', 'slug', 'status', 'tag', 'title', 'totalPosts', 'updatedAt', 'url'];
    $columns = LatestJobSchema.$columns;
}
__decorate([
    column.date(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "applicationEndDate", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "applicationStartDate", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "applyOnlineUrl", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "category", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "description", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "details", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "examDate", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "icon", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "location", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], LatestJobSchema.prototype, "meta", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "officialNotificationUrl", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "officialWebsiteUrl", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "organization", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], LatestJobSchema.prototype, "tag", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], LatestJobSchema.prototype, "title", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "totalPosts", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], LatestJobSchema.prototype, "url", void 0);
export class MediaSchema extends BaseModel {
    static $columns = ['collectionName', 'conversionsDisk', 'createdAt', 'customProperties', 'disk', 'fileName', 'generatedConversions', 'id', 'manipulations', 'mimeType', 'modelId', 'modelType', 'name', 'orderColumn', 'responsiveImages', 'size', 'updatedAt', 'uuid'];
    $columns = MediaSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", String)
], MediaSchema.prototype, "collectionName", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], MediaSchema.prototype, "conversionsDisk", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], MediaSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], MediaSchema.prototype, "customProperties", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], MediaSchema.prototype, "disk", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], MediaSchema.prototype, "fileName", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], MediaSchema.prototype, "generatedConversions", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], MediaSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], MediaSchema.prototype, "manipulations", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], MediaSchema.prototype, "mimeType", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], MediaSchema.prototype, "modelId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], MediaSchema.prototype, "modelType", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], MediaSchema.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], MediaSchema.prototype, "orderColumn", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], MediaSchema.prototype, "responsiveImages", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], MediaSchema.prototype, "size", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], MediaSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], MediaSchema.prototype, "uuid", void 0);
export class MigrationSchema extends BaseModel {
    static $columns = ['batch', 'id', 'migration'];
    $columns = MigrationSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Number)
], MigrationSchema.prototype, "batch", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], MigrationSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], MigrationSchema.prototype, "migration", void 0);
export class NotificationSchema extends BaseModel {
    static $columns = ['createdAt', 'data', 'id', 'notifiableId', 'notifiableType', 'readAt', 'type', 'updatedAt'];
    $columns = NotificationSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], NotificationSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], NotificationSchema.prototype, "data", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", String)
], NotificationSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], NotificationSchema.prototype, "notifiableId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], NotificationSchema.prototype, "notifiableType", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], NotificationSchema.prototype, "readAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], NotificationSchema.prototype, "type", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], NotificationSchema.prototype, "updatedAt", void 0);
export class PageSchema extends BaseModel {
    static $columns = ['content', 'createdAt', 'id', 'slug', 'title', 'updatedAt'];
    $columns = PageSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", String)
], PageSchema.prototype, "content", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], PageSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], PageSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PageSchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PageSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], PageSchema.prototype, "updatedAt", void 0);
export class PasswordResetTokenSchema extends BaseModel {
    static $columns = ['createdAt', 'email', 'token'];
    $columns = PasswordResetTokenSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], PasswordResetTokenSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", String)
], PasswordResetTokenSchema.prototype, "email", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PasswordResetTokenSchema.prototype, "token", void 0);
export class PostSchema extends BaseModel {
    static $columns = ['applicationEndDate', 'applicationStartDate', 'applyOnlineUrl', 'banner', 'categoryId', 'content', 'createdAt', 'examDate', 'id', 'isFeatured', 'isLive', 'isTrending', 'location', 'metaDescription', 'metaKeywords', 'metaTitle', 'officialNotificationUrl', 'officialWebsiteUrl', 'organization', 'schemaJson', 'shortDescription', 'slug', 'status', 'thumbnail', 'title', 'totalPosts', 'updatedAt', 'views'];
    $columns = PostSchema.$columns;
}
__decorate([
    column.date(),
    __metadata("design:type", Object)
], PostSchema.prototype, "applicationEndDate", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], PostSchema.prototype, "applicationStartDate", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "applyOnlineUrl", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "banner", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "categoryId", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "content", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], PostSchema.prototype, "createdAt", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], PostSchema.prototype, "examDate", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], PostSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], PostSchema.prototype, "isFeatured", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], PostSchema.prototype, "isLive", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], PostSchema.prototype, "isTrending", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "location", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "metaDescription", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "metaKeywords", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "metaTitle", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "officialNotificationUrl", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "officialWebsiteUrl", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "organization", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "schemaJson", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "shortDescription", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PostSchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PostSchema.prototype, "status", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "thumbnail", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PostSchema.prototype, "title", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "totalPosts", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], PostSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostSchema.prototype, "views", void 0);
export class PostButtonSchema extends BaseModel {
    static $columns = ['color', 'createdAt', 'id', 'label', 'postId', 'updatedAt', 'url'];
    $columns = PostButtonSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], PostButtonSchema.prototype, "color", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], PostButtonSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], PostButtonSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PostButtonSchema.prototype, "label", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostButtonSchema.prototype, "postId", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], PostButtonSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PostButtonSchema.prototype, "url", void 0);
export class PostDateSchema extends BaseModel {
    static $columns = ['createdAt', 'dateValue', 'id', 'label', 'postId', 'updatedAt'];
    $columns = PostDateSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], PostDateSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PostDateSchema.prototype, "dateValue", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], PostDateSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PostDateSchema.prototype, "label", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostDateSchema.prototype, "postId", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], PostDateSchema.prototype, "updatedAt", void 0);
export class PostFaqSchema extends BaseModel {
    static $columns = ['answer', 'createdAt', 'id', 'postId', 'question', 'updatedAt'];
    $columns = PostFaqSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", String)
], PostFaqSchema.prototype, "answer", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], PostFaqSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], PostFaqSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostFaqSchema.prototype, "postId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PostFaqSchema.prototype, "question", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], PostFaqSchema.prototype, "updatedAt", void 0);
export class PostFeeSchema extends BaseModel {
    static $columns = ['amount', 'categoryName', 'createdAt', 'id', 'postId', 'updatedAt'];
    $columns = PostFeeSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", String)
], PostFeeSchema.prototype, "amount", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PostFeeSchema.prototype, "categoryName", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], PostFeeSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], PostFeeSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostFeeSchema.prototype, "postId", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], PostFeeSchema.prototype, "updatedAt", void 0);
export class PostVacancySchema extends BaseModel {
    static $columns = ['createdAt', 'id', 'postId', 'postName', 'totalSeats', 'updatedAt'];
    $columns = PostVacancySchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], PostVacancySchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], PostVacancySchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PostVacancySchema.prototype, "postId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PostVacancySchema.prototype, "postName", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PostVacancySchema.prototype, "totalSeats", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], PostVacancySchema.prototype, "updatedAt", void 0);
export class PushSubscriptionSchema extends BaseModel {
    static $columns = ['authToken', 'contentEncoding', 'createdAt', 'endpoint', 'id', 'publicKey', 'subscribableId', 'subscribableType', 'updatedAt'];
    $columns = PushSubscriptionSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], PushSubscriptionSchema.prototype, "authToken", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PushSubscriptionSchema.prototype, "contentEncoding", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], PushSubscriptionSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PushSubscriptionSchema.prototype, "endpoint", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], PushSubscriptionSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PushSubscriptionSchema.prototype, "publicKey", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], PushSubscriptionSchema.prototype, "subscribableId", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], PushSubscriptionSchema.prototype, "subscribableType", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], PushSubscriptionSchema.prototype, "updatedAt", void 0);
export class ResultSchema extends BaseModel {
    static $columns = ['createdAt', 'details', 'icon', 'id', 'meta', 'slug', 'tag', 'title', 'updatedAt', 'url'];
    $columns = ResultSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], ResultSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ResultSchema.prototype, "details", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ResultSchema.prototype, "icon", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], ResultSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ResultSchema.prototype, "meta", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ResultSchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ResultSchema.prototype, "tag", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ResultSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], ResultSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ResultSchema.prototype, "url", void 0);
export class ReviewSchema extends BaseModel {
    static $columns = ['avatar', 'comment', 'createdAt', 'email', 'id', 'location', 'name', 'rating', 'status', 'updatedAt', 'userId'];
    $columns = ReviewSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], ReviewSchema.prototype, "avatar", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ReviewSchema.prototype, "comment", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], ReviewSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ReviewSchema.prototype, "email", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], ReviewSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ReviewSchema.prototype, "location", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ReviewSchema.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], ReviewSchema.prototype, "rating", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], ReviewSchema.prototype, "status", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], ReviewSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], ReviewSchema.prototype, "userId", void 0);
export class SavedJobSchema extends BaseModel {
    static $columns = ['createdAt', 'id', 'postId', 'updatedAt', 'userId'];
    $columns = SavedJobSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], SavedJobSchema.prototype, "createdAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], SavedJobSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SavedJobSchema.prototype, "postId", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], SavedJobSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SavedJobSchema.prototype, "userId", void 0);
export class SessionSchema extends BaseModel {
    static $columns = ['id', 'ipAddress', 'lastActivity', 'payload', 'userAgent', 'userId'];
    $columns = SessionSchema.$columns;
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", String)
], SessionSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SessionSchema.prototype, "ipAddress", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], SessionSchema.prototype, "lastActivity", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], SessionSchema.prototype, "payload", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SessionSchema.prototype, "userAgent", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SessionSchema.prototype, "userId", void 0);
export class SocialMediaSchema extends BaseModel {
    static $columns = ['createdAt', 'iconClass', 'id', 'isActive', 'order', 'platformName', 'updatedAt', 'url'];
    $columns = SocialMediaSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], SocialMediaSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SocialMediaSchema.prototype, "iconClass", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], SocialMediaSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], SocialMediaSchema.prototype, "isActive", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], SocialMediaSchema.prototype, "order", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], SocialMediaSchema.prototype, "platformName", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], SocialMediaSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], SocialMediaSchema.prototype, "url", void 0);
export class SubscriberSchema extends BaseModel {
    static $columns = ['createdAt', 'email', 'id', 'updatedAt'];
    $columns = SubscriberSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], SubscriberSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], SubscriberSchema.prototype, "email", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], SubscriberSchema.prototype, "id", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], SubscriberSchema.prototype, "updatedAt", void 0);
export class SyllabusSchema extends BaseModel {
    static $columns = ['createdAt', 'details', 'icon', 'id', 'meta', 'slug', 'tag', 'title', 'updatedAt', 'url'];
    $columns = SyllabusSchema.$columns;
}
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], SyllabusSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SyllabusSchema.prototype, "details", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SyllabusSchema.prototype, "icon", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], SyllabusSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SyllabusSchema.prototype, "meta", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], SyllabusSchema.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SyllabusSchema.prototype, "tag", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], SyllabusSchema.prototype, "title", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], SyllabusSchema.prototype, "updatedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], SyllabusSchema.prototype, "url", void 0);
export class UserSchema extends BaseModel {
    static $columns = ['avatar', 'createdAt', 'email', 'emailVerifiedAt', 'id', 'isAdmin', 'name', 'password', 'rememberToken', 'updatedAt'];
    $columns = UserSchema.$columns;
}
__decorate([
    column(),
    __metadata("design:type", Object)
], UserSchema.prototype, "avatar", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", Object)
], UserSchema.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserSchema.prototype, "email", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], UserSchema.prototype, "emailVerifiedAt", void 0);
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Object)
], UserSchema.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], UserSchema.prototype, "isAdmin", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], UserSchema.prototype, "name", void 0);
__decorate([
    column({ serializeAs: null }),
    __metadata("design:type", String)
], UserSchema.prototype, "password", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], UserSchema.prototype, "rememberToken", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], UserSchema.prototype, "updatedAt", void 0);
//# sourceMappingURL=schema.js.map