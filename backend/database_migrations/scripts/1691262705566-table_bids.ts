import { query } from "express"
import { MigrationInterface, QueryRunner } from "typeorm"

export class Bids1691262705566 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS bids (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            bidder_id UUID REFERENCES users(id),
            product_id UUID REFERENCES products(id),
            price INT NOT NULL,
            status VARCHAR(255) NOT NULL NOT NULL,
            created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
            updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS bids;`);
    }
}

/**
 * 
 * when is_final === false: means the payment still can be updated to PAYMENT_VOID (refunded)
 * when ON_GOING, WIN, REFUND
 */
