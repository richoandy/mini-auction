import { DataSource, QueryRunner, Not } from 'typeorm';
import { IBid, IBidRepo } from '../entity';
import Bid from './model';
import { Query } from 'typeorm/driver/Query';

export default class BidRepo implements IBidRepo {
    private dbConnection: DataSource;
    
    constructor(dbConnection: DataSource) {
        this.dbConnection = dbConnection;
    }
    
    async create(trx: QueryRunner, payload: IBid): Promise<IBid> {
        try {
            const bid = new Bid();
            bid.bidder_id = payload.bidder_id;
            bid.product_id = payload.product_id;
            bid.price = payload.price;
            bid.status = payload.status;

            return await trx.manager.save(bid);
        } catch (error) {
            throw error;
        }
    }
    
    async list(trx: QueryRunner, status: string, productId: string): Promise<IBid[]> {
        return await trx.manager
            .createQueryBuilder()
            .select()
            .from(Bid, 'bid')
            .where('bid.status = :status AND bid.product_id = :productId', {
                status,
                productId,
            })
            .getRawMany();
    }

    async update(trx: QueryRunner, payload: IBid): Promise<void> {
        trx.manager
        .createQueryBuilder()
        .update(Bid)
        .set({
            ... payload,
            updated_at: new Date(),
        })
        .where('id = :id', { id: payload.id })
        .execute();
    }

    async updateByProductId(trx: QueryRunner, payload: IBid): Promise<void> {
        console.log('testtt');
        trx.manager
        .createQueryBuilder()
        .update(Bid)
        .set({
            ...payload,
            updated_at: new Date()
        })
        .where('product_id = :product_id')
        .andWhere('status = :status')
        .setParameters({
            product_id: payload.product_id,
            status: 'ON_GOING'
        })
        .execute();
    }
}