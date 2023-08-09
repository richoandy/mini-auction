import { MigrationInterface, QueryRunner } from "typeorm"

export class BalanceHistory1691263121379 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS balance_history (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id UUID REFERENCES users(id),
            bid_id UUID REFERENCES bids(id),
            type VARCHAR(255) NOT NULL,
            amount INT NOT NULL,
            previous_balance INT NOT NULL,
            updated_balance INT NOT NULL,
            created_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
            updated_at timestamptz NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS balance_history;`);
    }

}

/**
 * 
 *
 * TYPE enums: TOP_UP, PAYMENT, REFUND, 
 * 
 * if the bid loses OR user make a new bid with higher price, payment will be refunded (PAYMNET_VOID), user got their balance back and they will make new payment for the new bid
 */