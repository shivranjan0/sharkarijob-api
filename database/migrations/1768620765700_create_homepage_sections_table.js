import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'homepage_sections';
    async up() {
        if (await this.db.schema.hasTable(this.tableName))
            return;
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id').unsigned().notNullable();
            table.string('section_key').notNullable().unique();
            table.string('title').notNullable();
            table.integer('post_limit').notNullable().defaultTo(6);
            table.string('sort_by').notNullable().defaultTo('latest');
            table.boolean('is_enabled').notNullable().defaultTo(true);
            table.timestamp('created_at').nullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTableIfExists(this.tableName);
    }
}
//# sourceMappingURL=1768620765700_create_homepage_sections_table.js.map