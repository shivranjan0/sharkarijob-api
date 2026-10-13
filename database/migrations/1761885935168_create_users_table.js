import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'users';
    async up() {
        if (await this.db.schema.hasTable(this.tableName))
            return;
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id').unsigned().notNullable();
            table.string('name').notNullable();
            table.string('email').notNullable().unique();
            table.string('avatar').nullable();
            table.timestamp('email_verified_at').nullable();
            table.string('password').notNullable();
            table.boolean('is_admin').notNullable().defaultTo(false);
            table.string('remember_token', 100).nullable();
            table.timestamp('created_at').nullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTableIfExists(this.tableName);
    }
}
//# sourceMappingURL=1761885935168_create_users_table.js.map