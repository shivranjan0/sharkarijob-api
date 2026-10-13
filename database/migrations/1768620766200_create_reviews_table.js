import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'reviews';
    async up() {
        if (await this.db.schema.hasTable(this.tableName))
            return;
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id').unsigned().notNullable();
            table
                .bigInteger('user_id')
                .unsigned()
                .nullable()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            table.string('name').notNullable();
            table.string('email').notNullable();
            table.string('location').nullable();
            table.integer('rating').notNullable().defaultTo(5);
            table.text('comment').notNullable();
            table.string('avatar').nullable();
            table.enum('status', ['pending', 'approved']).notNullable().defaultTo('pending');
            table.timestamp('created_at').nullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTableIfExists(this.tableName);
    }
}
//# sourceMappingURL=1768620766200_create_reviews_table.js.map