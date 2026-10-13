import { BaseCommand } from '@adonisjs/core/ace';
import { DateTime } from 'luxon';
import db from '@adonisjs/lucid/services/db';
import Category from '#models/category';
import Post from '#models/post';
export default class MigrateLegacy extends BaseCommand {
    static commandName = 'migrate:legacy';
    static description = 'Migrates data from old separate tables to the unified posts table';
    static options = {
        startApp: true
    };
    async run() {
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
            this.logger.info(`Migrating ${table.tableName}...`);
            let category = await Category.findBy('name', table.categoryName);
            if (!category) {
                category = await Category.create({ name: table.categoryName, slug: table.categoryName.toLowerCase().replace(/ /g, '-') });
            }
            let records;
            try {
                records = await db.from(table.tableName).select('*');
            }
            catch (e) {
                this.logger.warning(`Table ${table.tableName} not found or failed to query`);
                continue;
            }
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
                        metaTitle: record.meta || '',
                        metaDescription: record.meta || '',
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
            this.logger.success(`Migrated ${count} new records from ${table.tableName} to posts table.`);
        }
    }
}
//# sourceMappingURL=migrate_legacy.js.map