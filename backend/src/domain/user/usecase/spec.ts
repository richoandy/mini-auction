import * as dotenv from 'dotenv'; dotenv.config();
import { QueryRunner } from 'typeorm';
import { IUser, IUserRepo } from '../entity';
import UserUsecase from '../usecase';
import Encryptor from '../../../mock/encryptor.mock';
import TransactionManagerMock from '../../../mock/transaction_manager.mock';
import { IBalanceHistory, IBalanceHistoryRepo } from 'domain/balance_history/entity';

const userDataMock = {
    id: 'abc-123', 
    email: 'test@mail.com',
    password: 'test_password',
    balance: 5000,
    last_bid_at: new Date('2023-08-03'),
    created_at: new Date('2023-08-03'),
    updated_at: new Date('2023-08-03'),
}

const userRepoMock: IUserRepo = {
    create: async (trx: QueryRunner, user: IUser): Promise<IUser> => {
        return userDataMock
    },

    findByEmail: async (trx: QueryRunner, user: IUser): Promise<IUser> => {
        return {
            ...userDataMock,
            email: 'new_test@email.com',
        };
    },

    findById: async (trx: QueryRunner, user:IUser): Promise<IUser> => {
        return userDataMock;
    },

    update: async (trx: QueryRunner, user: IUser): Promise<any> => {
        return userDataMock;
    }
}

const balanceHistoryMock: IBalanceHistoryRepo = {
    create: async (trx: QueryRunner, payload: IBalanceHistory): Promise<IBalanceHistory> => {
        return {
            id: 'abc-123',
            user_id: 'abc-123',
            bid_id: 'abc-123',
            type: 'type-test',
            amount: 123,
            previous_balance: 1000,
            updated_balance: 2000
        }
    }
}

const transactionManager = new TransactionManagerMock();

const encryptor = new Encryptor(true);

const userUsecase = new UserUsecase(transactionManager, userRepoMock, encryptor, balanceHistoryMock);

describe('UserUsecase: Sign Up', () => {
    test('Success', async () => {
        const result = await userUsecase.signUp({
            ...userDataMock,
            email: 'user_test@mail.com',
        });

        expect(result).toBe(userDataMock);
    });

    test('EMAIL_IS_ALREADY_USED', async () => {
        try {
            await userUsecase.signUp({
                ...userDataMock,
            })
        } catch (error) {
            expect(error.message).toBe('EMAIL_IS_ALREADY_USED');
        }
    });
});

describe('UserUsecase: Sign In', () => {
    test('Success', async () => {
        const result = await userUsecase.signIn({
            ...userDataMock
        });

        expect(result).toHaveProperty('token');
    });

    test('PASSWORD_NOT_MATCH', async () => {
        // new userUsecase object to return false when checking hashed password
        const encryptor = new Encryptor(false);
        const userUsecase = new UserUsecase(transactionManager, userRepoMock, encryptor, balanceHistoryMock);

        try {
            await userUsecase.signIn({
                ...userDataMock
            });
        } catch (error) {
            expect(error.message).toBe('PASSWORD_NOT_MATCH');
        }
    })
});

describe('UserUserCase: Deposit', () => {
    test('Success', async () => {
        const result = await userUsecase.deposit(userDataMock, 5000);
        
        expect(result.balance).toBe(10000);
    });
});
