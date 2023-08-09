export interface IBalanceHistory {
    id?: string;
    user_id?: string;
    bid_id?: string;
    type?: string,
    amount?: number,
    previous_balance?: number,
    updated_balance?: number
}

export interface IBalanceHistoryRepo {
    create(queryRunner, IBalanceHistory): Promise<IBalanceHistory>;
}