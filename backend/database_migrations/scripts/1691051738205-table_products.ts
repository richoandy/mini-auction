import { MigrationInterface, QueryRunner } from "typeorm"

export class TableProducts1691051738205 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS products (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            seller_id UUID NOT NULL REFERENCES users(id),
            name VARCHAR(255) NOT NULL,
            starting_price INT NOT NULL,
            current_price INT NOT NULL,
            is_available BOOLEAN DEFAULT true,
            time_window INT NOT NULL,
            created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
            updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS products`);
    }
}
