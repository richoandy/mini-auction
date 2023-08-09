import { QueryRunner, DataSource } from "typeorm";
import { Query } from "typeorm/driver/Query";
import { ITransactionManager } from "util/transaction_manager/interface";

export interface IProduct {
    id?: string;
    seller_id?: string; // FK to User
    name?: string;
    starting_price?: number;
    current_price?: number;
    is_available?: boolean;
    time_window?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface IPagination {
    page: number;
    limit: number;
}

export interface IProductRepo {
    create (QueryRunner, IProduct): Promise<IProduct>;
    update (QueryRunner, IProduct): Promise<any>;
    findById (QueryRunner, IProduct): Promise<IProduct>;
    listOpenBidProducts (QueryRunner): Promise<IProduct[]>;
    listProducts (QueryRunner, isAvailableQuery: boolean): Promise<IProduct[]>;
}

export interface IProductUsecase {
    create(IProduct, userId: string): Promise<IProduct>;
    list(isAvailable: string): Promise<IProduct[]>;
    finalizeOpenToBid(): Promise<void>; // to be triggered by cron jobs
}
