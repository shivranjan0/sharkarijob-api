import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'users';
    async up() {
        if (!(await this.db.schema.hasTable(this.tableName)))
            return;
        const columns = [
            ['two_factor_secret', (table) => table.text('two_factor_secret').nullable()],
            [
                'two_factor_confirmed_at',
                (table) => table.timestamp('two_factor_confirmed_at').nullable(),
            ],
            [
                'two_factor_recovery_codes',
                (table) => table.text('two_factor_recovery_codes').nullable(),
            ],
        ];
        for (const [name, add] of columns) {
            if (await this.db.schema.hasColumn(this.tableName, name))
                continue;
            this.schema.alterTable(this.tableName, add);
        }
    }
    async down() {
        if (!(await this.db.schema.hasTable(this.tableName)))
            return;
        for (const name of [
            'two_factor_secret',
            'two_factor_confirmed_at',
            'two_factor_recovery_codes',
        ]) {
            if (!(await this.db.schema.hasColumn(this.tableName, name)))
                continue;
            this.schema.alterTable(this.tableName, (table) => table.dropColumn(name));
        }
    }
}
//# sourceMappingURL=1768620768000_add_two_factor_to_users_table.js.map