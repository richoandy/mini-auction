import { MigrationInterface, QueryRunner } from "typeorm"

export class ExtensionUuidOssp1691050881722 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       `DROP EXTENSION IF EXISTS "uuid-ossp`;
    }
}
