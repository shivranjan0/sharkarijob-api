import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'push_subscriptions';
    async up() {
        if (await this.db.schema.hasTable(this.tableName))
            return;
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id').unsigned().notNullable();
            table.string('subscribable_type').notNullable();
            table.bigInteger('subscribable_id').unsigned().notNullable();
            table.index(['subscribable_type', 'subscribable_id'], 'push_subscriptions_subscribable_morph_idx');
            table.specificType('endpoint', 'varchar(1024) CHARACTER SET ascii').notNullable().unique();
            table.string('public_key').nullable();
            table.string('auth_token').nullable();
            table.string('content_encoding').nullable();
            table.timestamp('created_at').nullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTableIfExists(this.tableName);
    }
}
//# sourceMappingURL=1768620766900_create_push_subscriptions_table.js.map