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
import hash from '@adonisjs/core/services/hash';
import { compose } from '@adonisjs/core/helpers';
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid';
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens';
import { hasMany } from '@adonisjs/lucid/orm';
import Media from '#models/media';
export default class User extends compose(BaseModel, withAuthFinder(hash)) {
    static accessTokens = DbAccessTokensProvider.forModel(User);
    static table = 'users';
    verifyPassword(plainPassword) {
        const stored = this.password;
        if (!stored) {
            return Promise.resolve(false);
        }
        const normalised = stored.startsWith('$2y$') ? `$2b$${stored.slice(4)}` : stored;
        return hash.verify(normalised, plainPassword);
    }
    get initials() {
        const [first, last] = this.name ? this.name.split(' ') : this.email.split('@');
        if (first && last) {
            return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
        }
        return `${first.slice(0, 2)}`.toUpperCase();
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", Object)
], User.prototype, "emailVerifiedAt", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], User.prototype, "avatar", void 0);
__decorate([
    column({ serializeAs: null }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    column(),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
__decorate([
    column({ serializeAs: null }),
    __metadata("design:type", Object)
], User.prototype, "rememberToken", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], User.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", Object)
], User.prototype, "updatedAt", void 0);
__decorate([
    hasMany(() => Media, {
        foreignKey: 'modelId',
        onQuery: (query) => {
            query.where('model_type', 'App\\Models\\User');
        }
    }),
    __metadata("design:type", Object)
], User.prototype, "media", void 0);
//# sourceMappingURL=user.js.map