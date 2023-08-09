import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTableUsers1691050288728 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS users (
           id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
           email VARCHAR(255) NOT NULL UNIQUE,
           password VARCHAR(255) NOT NULL,
           balance INT NOT NULL DEFAULT 0, 
           last_bid_at timestamptz,
           created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
           updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS users;`);

    }
}
