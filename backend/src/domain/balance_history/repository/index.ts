import { DataSource, QueryRunner } from 'typeorm';
import { IBalanceHistory, IBalanceHistoryRepo } from '../entity';
import BalanceHistory from './model';

export default class BalanceHistoryRepo implements IBalanceHistoryRepo {
    private dbConnection: DataSource;

    constructor(dbConnection: DataSource) {
        this.dbConnection = dbConnection;
    }

    async create(trx: QueryRunner, payload: IBalanceHistory) {
        const balanceHistory = new BalanceHistory();

        balanceHistory.user_id = payload.user_id;
        balanceHistory.amount = payload.amount;
        balanceHistory.previous_balance = payload.previous_balance;
        balanceHistory.updated_balance = payload.updated_balance;
        balanceHistory.type = payload.type;
        if (payload.type === 'PAYMENT' || 'REFUND') {
            balanceHistory.bid_id = payload.bid_id;
        }

        return trx.manager.save(balanceHistory);
    }
}