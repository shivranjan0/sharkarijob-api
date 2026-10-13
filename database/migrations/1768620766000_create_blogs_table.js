import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'blogs';
    async up() {
        if (await this.db.schema.hasTable(this.tableName))
            return;
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id').unsigned().notNullable();
            table.string('title').notNullable();
            table.string('slug').notNullable().unique();
            table.string('category').notNullable();
            table.text('description').nullable();
            table.text('table_of_contents', 'longtext').nullable();
            table.text('content', 'longtext').notNullable();
            table.string('image').nullable();
            table.boolean('is_featured').notNullable().defaultTo(false);
            table.string('status').notNullable().defaultTo('published');
            table.string('meta_title').nullable();
            table.text('meta_description').nullable();
            table.text('meta_keywords').nullable();
            table.timestamp('created_at').nullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTableIfExists(this.tableName);
    }
}
//# sourceMappingURL=1768620766000_create_blogs_table.js.map