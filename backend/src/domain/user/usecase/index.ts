import * as jwt from 'jsonwebtoken';
import { QueryRunner } from 'typeorm';
import { ITransactionManager } from 'util/transaction_manager/interface';
import { IUser, ISessionToken, IUserUsecase, IUserRepo } from '../entity';
import { IEncryptor } from 'util/encryptor/interface';
import { IBalanceHistoryRepo } from '../../../domain/balance_history/entity';

export default class UserUsecase implements IUserUsecase {
    private userRepo: IUserRepo;
    private balanceHistoryRepo: IBalanceHistoryRepo;
    private transactionManager: ITransactionManager<any>;
    private encryptor: IEncryptor;

    constructor(transactionManager: ITransactionManager<any>, userRepo: IUserRepo, encryptor: IEncryptor, balanceHistoryRepo: IBalanceHistoryRepo) {
        this.transactionManager = transactionManager;
        this.userRepo = userRepo;
        this.encryptor = encryptor;
        this.balanceHistoryRepo = balanceHistoryRepo;
    }

    async signUp(user: IUser): Promise<IUser> {
        const trx = await this.transactionManager.start();

        try {
            const sameEmailUser = await this.userRepo.findByEmail(trx, { email: user.email });

            if (sameEmailUser && (sameEmailUser.email === user.email)) {
                throw new Error('EMAIL_IS_ALREADY_USED');
            }

            user.password = await this.encryptor.hash(user.password);
            const result = await this.userRepo.create(trx, user);

            await this.transactionManager.commit(trx);
            return result;
        } catch (error) {
            console.log(error);
            await this.transactionManager.rollback(trx);
            throw error;
        }
    }

    async signIn(user: IUser): Promise<ISessionToken> {
        const trx = await this.transactionManager.start();

        try {
            const result = await this.userRepo.findByEmail(trx, user);

            if (!await this.encryptor.compare(user.password, result.password)) {
                throw new Error("PASSWORD_NOT_MATCH");
            }

            const token = jwt.sign(
                {
                    user_id: result.id
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: 24 * 365 + 'h'
                }
            );

            await this.transactionManager.commit(trx);
            return {
                token
            };
        } catch (error) {
            await this.transactionManager.rollback(trx);
            throw error;
        }
    }

    async deposit(user: IUser, amount: number): Promise<IUser> {
        const trx = await this.transactionManager.start();

        try {
            const foundUser = await this.userRepo.findById(trx, user);
            
            // TODO: handle error if user_id is not found in the users table

            const updatedBalance = Number(foundUser.balance) + Number(amount);
            const updatedBalanceHistory =  {
                user_id: user.id,
                type: 'TOP_UP',
                amount,
                previous_balance: foundUser.balance,
                updated_balance: updatedBalance
            };
            const updatedBalanceUser = {
                ...foundUser,
                balance: updatedBalance
            };

            await this.balanceHistoryRepo.create(trx, updatedBalanceHistory);
    
            await this.userRepo.update(trx, updatedBalanceUser);

            await this.transactionManager.commit(trx);
            return updatedBalanceUser;
        } catch (error) {
            await this.transactionManager.rollback(trx);
            throw error;
        }
    }
    
    async getProfile(user: IUser): Promise<IUser> {
        const trx = await this.transactionManager.start();

        try {
            const foundUser = await this.userRepo.findById(trx, user);
            await this.transactionManager.commit(trx);
            return foundUser;
        } catch (error) {
            await this.transactionManager.rollback(trx);
            throw error;
        }
    }
}