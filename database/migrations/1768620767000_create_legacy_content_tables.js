import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'legacy_content';
    simpleTables = ['answer_keys', 'documents', 'results', 'admissions', 'syllabi'];
    nullableSlugTables = ['admit_cards'];
    async up() {
        for (const name of [...this.simpleTables, ...this.nullableSlugTables]) {
            if (await this.db.schema.hasTable(name))
                continue;
            const slugIsNullable = this.nullableSlugTables.includes(name);
            this.schema.createTable(name, (table) => {
                table.bigIncrements('id').unsigned().notNullable();
                table.string('title').notNullable();
                table.string('tag').nullable();
                table.string('meta').nullable();
                table.string('url').nullable();
                const slug = table.string('slug');
                if (slugIsNullable) {
                    slug.nullable();
                }
                else {
                    slug.notNullable();
                }
                slug.unique();
                table.string('icon').nullable();
                table.json('details').nullable();
                table.timestamp('created_at').nullable();
                table.timestamp('updated_at').nullable();
            });
        }
        if (!(await this.db.schema.hasTable('latest_jobs'))) {
            this.schema.createTable('latest_jobs', (table) => {
                table.bigIncrements('id').unsigned().notNullable();
                table.string('title').notNullable();
                table.string('tag').notNullable();
                table.string('meta').notNullable();
                table.string('url').nullable();
                table.string('slug').nullable().unique();
                table.string('icon').nullable();
                table.json('details').nullable();
                table.string('organization').nullable();
                table.string('total_posts').nullable();
                table.string('category').nullable();
                table.string('status').nullable();
                table.date('application_start_date').nullable();
                table.date('application_end_date').nullable();
                table.date('exam_date').nullable();
                table.string('location').nullable();
                table.string('apply_online_url').nullable();
                table.string('official_notification_url').nullable();
                table.string('official_website_url').nullable();
                table.text('description').nullable();
                table.timestamp('created_at').nullable();
                table.timestamp('updated_at').nullable();
            });
        }
    }
    async down() {
        for (const name of [...this.simpleTables, ...this.nullableSlugTables, 'latest_jobs']) {
            this.schema.dropTableIfExists(name);
        }
    }
}
//# sourceMappingURL=1768620767000_create_legacy_content_tables.js.map