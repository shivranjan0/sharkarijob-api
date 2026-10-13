import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'notifications';
    async up() {
        if (await this.db.schema.hasTable(this.tableName))
            return;
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary();
            table.string('type').notNullable();
            table.string('notifiable_type').notNullable();
            table.bigInteger('notifiable_id').unsigned().notNullable();
            table.index(['notifiable_type', 'notifiable_id'], 'notifications_notifiable_index');
            table.text('data').notNullable();
            table.timestamp('read_at').nullable();
            table.timestamp('created_at').nullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTableIfExists(this.tableName);
    }
}
//# sourceMappingURL=1768620766800_create_notifications_table.js.map