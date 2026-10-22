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
export default class Paper extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Paper.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Paper.prototype, "slug", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Paper.prototype, "exam", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Paper.prototype, "examName", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Paper.prototype, "year", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Paper.prototype, "shift", void 0);
__decorate([
    column.date(),
    __metadata("design:type", Object)
], Paper.prototype, "examDate", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Paper.prototype, "totalQuestions", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Paper.prototype, "markingScheme", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Paper.prototype, "pdfUrl", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Paper.prototype, "fileHash", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Paper.prototype, "uploadedBy", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Paper.prototype, "status", void 0);
__decorate([
    column({
        prepare: (value) => (value ? JSON.stringify(value) : null),
        consume: (value) => (typeof value === 'string' ? JSON.parse(value) : (value ?? [])),
    }),
    __metadata("design:type", Array)
], Paper.prototype, "questions", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Paper.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Paper.prototype, "updatedAt", void 0);
//# sourceMappingURL=paper.js.map