import { DataSource, QueryRunner, Not } from 'typeorm';
import { IPagination, IProduct, IProductRepo } from '../entity';
import Product from './model';

export default class ProductRepo implements IProductRepo {
    private dbConnection: DataSource;

    constructor(dbConnection: DataSource) {
        this.dbConnection = dbConnection;
    }

    async create(trx: QueryRunner, payload: IProduct): Promise<IProduct> {
        try {
            const product = new Product();
            product.seller_id = payload.seller_id;
            product.name = payload.name;
            product.starting_price = payload.starting_price;
            product.current_price = payload.starting_price;
            product.time_window = payload.time_window;
            
            return await trx.manager.save(product); 
        } catch (error) {
            throw error;
        }

    }

    async update(trx: QueryRunner, payload: IProduct): Promise<any> {
        return trx.manager
        .createQueryBuilder()
        .update(Product)
        .set({
            ... payload,
            updated_at: new Date(),
        })
        .where('id = :id', { id: payload.id })
        .execute();
    }

    async findById(trx: QueryRunner, payload: IProduct): Promise<IProduct> {
        return trx.manager.findOne(Product, {
            where: {
                id: payload.id
            }
        })
    }

    async listOpenBidProducts(trx: QueryRunner): Promise<IProduct[]> {
        return trx.manager
            .createQueryBuilder()
            .from(Product, 'products')
            .where('products.is_available = :is_available', { is_available: true })
            .getRawMany();
    }

    async listProducts(trx: QueryRunner, isAvailableQuery: boolean): Promise<IProduct[]> {
        return trx.manager
            .createQueryBuilder()
            .from(Product, 'products')
            .where('products.is_available = :is_available', { is_available: isAvailableQuery })
            .getRawMany();
    }
}