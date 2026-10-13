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
export default class Syllabus extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Syllabus.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Syllabus.prototype, "title", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Syllabus.prototype, "tag", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Syllabus.prototype, "meta", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Syllabus.prototype, "url", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Syllabus.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Syllabus.prototype, "icon", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Syllabus.prototype, "details", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Syllabus.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Syllabus.prototype, "updatedAt", void 0);
//# sourceMappingURL=syllabus.js.map