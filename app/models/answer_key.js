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
import { BaseModel, column } from '@adonisjs/lucid/orm';
export default class AnswerKey extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], AnswerKey.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], AnswerKey.prototype, "title", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AnswerKey.prototype, "tag", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AnswerKey.prototype, "meta", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AnswerKey.prototype, "url", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AnswerKey.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AnswerKey.prototype, "icon", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], AnswerKey.prototype, "details", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], AnswerKey.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], AnswerKey.prototype, "updatedAt", void 0);
//# sourceMappingURL=answer_key.js.map