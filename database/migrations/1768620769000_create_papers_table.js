import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'papers';
    async up() {
        if (await this.db.schema.hasTable(this.tableName))
            return;
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id').unsigned().notNullable();
            table.string('slug').notNullable().unique();
            table.string('exam', 100).notNullable().index();
            table.string('exam_name', 150).notNullable();
            table.integer('year').notNullable();
            table.string('shift', 100).nullable();
            table.date('exam_date').nullable();
            table.integer('total_questions').notNullable().defaultTo(0);
            table.string('marking_scheme', 500).nullable();
            table.string('pdf_url', 500).nullable();
            table.string('file_hash', 64).nullable().unique();
            table.string('uploaded_by', 150).nullable();
            table.enum('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending');
            table.json('questions').nullable();
            table.timestamp('created_at').nullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTableIfExists(this.tableName);
    }
}
//# sourceMappingURL=1768620769000_create_papers_table.js.map