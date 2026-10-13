import { DateTime } from 'luxon';
import db from '@adonisjs/lucid/services/db';
import Category from '#models/category';
import Post from '#models/post';
export default class MigrateLegacyData {
    async handle() {
        const tables = [
            { tableName: 'admit_cards', categoryName: 'Admit Card' },
            { tableName: 'latest_jobs', categoryName: 'Latest Jobs' },
            { tableName: 'results', categoryName: 'Results' },
            { tableName: 'answer_keys', categoryName: 'Answer Key' },
            { tableName: 'syllabi', categoryName: 'Syllabus' },
            { tableName: 'admissions', categoryName: 'Admission' },
            { tableName: 'documents', categoryName: 'Important Document' },
        ];
        for (const table of tables) {
            console.log(`Migrating ${table.tableName}...`);
            let category = await Category.findBy('name', table.categoryName);
            if (!category) {
                category = await Category.create({ name: table.categoryName, slug: table.categoryName.toLowerCase().replace(/ /g, '-') });
            }
            const hasTable = await db.connection().schema.hasTable(table.tableName);
            if (!hasTable)
                continue;
            const records = await db.from(table.tableName).select('*');
            let count = 0;
            for (const record of records) {
                const exists = await Post.findBy('slug', record.slug);
                if (!exists) {
                    let content = '';
                    if (record.details) {
                        try {
                            const details = typeof record.details === 'string' ? JSON.parse(record.details) : record.details;
                            content = `<p>${JSON.stringify(details)}</p>`;
                        }
                        catch (e) {
                        }
                    }
                    if (record.description) {
                        content = record.description;
                    }
                    await Post.create({
                        title: record.title,
                        slug: record.slug,
                        categoryId: category.id,
                        status: record.status || 'published',
                        isLive: true,
                        isFeatured: false,
                        isTrending: false,
                        metaTitle: record.meta,
                        metaDescription: record.meta,
                        content: content,
                        applyOnlineUrl: record.apply_online_url || record.url || null,
                        officialNotificationUrl: record.official_notification_url || null,
                        officialWebsiteUrl: record.official_website_url || null,
                        createdAt: record.created_at ? DateTime.fromJSDate(new Date(record.created_at)) : DateTime.now(),
                        updatedAt: record.updated_at ? DateTime.fromJSDate(new Date(record.updated_at)) : DateTime.now(),
                    });
                    count++;
                }
            }
            console.log(`Migrated ${count} new records from ${table.tableName} to posts table.`);
        }
    }
}
const migration = new MigrateLegacyData();
migration.handle().then(() => {
    console.log('Migration complete');
    process.exit(0);
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=migrate_legacy_data.js.map