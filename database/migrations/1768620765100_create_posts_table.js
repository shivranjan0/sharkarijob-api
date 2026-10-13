import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'posts';
    async up() {
        if (await this.db.schema.hasTable(this.tableName))
            return;
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id').unsigned().notNullable();
            table
                .bigInteger('category_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('categories')
                .onDelete('CASCADE');
            table.string('title').notNullable();
            table.string('slug').notNullable().unique();
            table.text('short_description').nullable();
            table.text('content', 'longtext').nullable();
            table.string('organization').nullable();
            table.string('location').nullable();
            table.string('total_posts').nullable();
            table.date('application_start_date').nullable();
            table.date('application_end_date').nullable();
            table.date('exam_date').nullable();
            table.string('apply_online_url').nullable();
            table.string('official_notification_url').nullable();
            table.string('official_website_url').nullable();
            table.string('thumbnail').nullable();
            table.string('banner').nullable();
            table.enum('status', ['draft', 'published']).notNullable().defaultTo('draft');
            table.boolean('is_live').notNullable().defaultTo(false);
            table.bigInteger('views').notNullable().defaultTo(0);
            table.boolean('is_featured').notNullable().defaultTo(false);
            table.boolean('is_trending').notNullable().defaultTo(false);
            table.string('meta_title').nullable();
            table.text('meta_description').nullable();
            table.string('meta_keywords').nullable();
            table.json('schema_json').nullable();
            table.timestamp('created_at').nullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTableIfExists(this.tableName);
    }
}
//# sourceMappingURL=1768620765100_create_posts_table.js.map