import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'media';
    async up() {
        if (await this.db.schema.hasTable(this.tableName))
            return;
        this.schema.createTable(this.tableName, (table) => {
            table.bigIncrements('id').unsigned().notNullable();
            table.string('model_type').notNullable();
            table.bigInteger('model_id').unsigned().notNullable();
            table.index(['model_type', 'model_id'], 'media_model_type_model_id_index');
            table.uuid('uuid').nullable().unique();
            table.string('collection_name').notNullable();
            table.string('name').notNullable();
            table.string('file_name').notNullable();
            table.string('mime_type').nullable();
            table.string('disk').notNullable();
            table.string('conversions_disk').nullable();
            table.bigInteger('size').unsigned().notNullable();
            table.json('manipulations').notNullable();
            table.json('custom_properties').notNullable();
            table.json('generated_conversions').notNullable();
            table.json('responsive_images').notNullable();
            table.integer('order_column').unsigned().nullable().index();
            table.timestamp('created_at').nullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTableIfExists(this.tableName);
    }
}
//# sourceMappingURL=1768620766600_create_media_table.js.map