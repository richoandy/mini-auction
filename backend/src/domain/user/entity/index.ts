import { DropDatabaseOptions, QueryRunner } from 'typeorm';
import { ITransactionManager } from 'util/transaction_manager/interface';

export interface IUser {
    id?: string;
    email?: string;
    password?: string;
    balance?: number;
    last_bid_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface ISessionToken {
    token: string;
}

export interface IUserRepo {
    create (QueryRunner, IUser): Promise<IUser>;
    findByEmail(QueryRunner, IUser): Promise<IUser>;
    findById(QueryRunner, IUser): Promise<IUser>;
    update(QueryRunner, IUser): Promise<any>
}

export interface IUserUsecase {
    signUp (user: IUser): Promise<IUser>;
    signIn (user: IUser): Promise<ISessionToken>;
    deposit(user: IUser, depositAmount: number): Promise<IUser>
    getProfile(user: IUser): Promise<IUser>;
}