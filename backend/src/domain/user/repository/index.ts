import { DataSource, QueryRunner } from 'typeorm';
import { IUser, IUserRepo } from '../entity';
import User from './model';
import { Query } from 'typeorm/driver/Query';

export default class UserRepo implements IUserRepo {
    private dbConnection: DataSource;

    constructor (dbConnection: DataSource) {
        this.dbConnection = dbConnection;
    }
    
    async create(trx: QueryRunner, payload: IUser): Promise<IUser> {
        const user = new User();
        user.email = payload.email;
        user.password = payload.password;

        return trx.manager.save(user);
    }

    async findByEmail(trx: QueryRunner, payload: IUser): Promise<IUser> {
        return  trx.manager.findOne(User, {
            where: {
                email: payload.email
            }
        });

    }

    async findById(trx: QueryRunner, payload: IUser): Promise<IUser> {
        return trx.manager.findOne(User, {
            where: {
                id: payload.id
            }
        })
    }

    async update(trx: QueryRunner, payload: IUser): Promise<any> {
        return trx.manager
        .createQueryBuilder()
        .update(User)
        .set({
            ... payload,
            updated_at: new Date(),
        })
        .where('id = :id', { id: payload.id })
        .execute();
    }
}