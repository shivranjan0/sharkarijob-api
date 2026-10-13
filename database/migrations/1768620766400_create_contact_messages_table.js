import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'contact_messages';
    async up() {
        if (await this.db.schema.hasTable(this.tableName))
            return;
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id').unsigned().notNullable();
            table.string('name').notNullable();
            table.string('email').notNullable();
            table.string('subject').nullable();
            table.text('message').notNullable();
            table.string('attachment').nullable();
            table.boolean('is_read').notNullable().defaultTo(false);
            table.timestamp('created_at').nullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTableIfExists(this.tableName);
    }
}
//# sourceMappingURL=1768620766400_create_contact_messages_table.js.map