import { QueryRunner } from 'typeorm';
import { ITransactionManager } from 'util/transaction_manager/interface';
import { IProduct, IProductRepo, IProductUsecase } from '../entity';
import { IUserRepo } from '../../../domain/user/entity';
import { isProductTimeWindowInvalid } from '../../../domain/product/usecase/helper';
import BidRepo from 'domain/bid/repository';
import { IBidRepo } from 'domain/bid/entity';

export default class ProductUsecase implements IProductUsecase {
    private transactionManager: ITransactionManager<any>;
    private productRepo: IProductRepo;
    private userRepo: IUserRepo;
    private bidRepo: IBidRepo;

    constructor(transactionManager: ITransactionManager<any>, productRepo: IProductRepo, userRepo: IUserRepo, bidRepo: IBidRepo) {
        this.transactionManager = transactionManager;
        this.productRepo = productRepo;
        this.bidRepo = bidRepo;
        this.userRepo = userRepo;
    }

    /**
     * TODO: refactor for server-side pagination with IPagination
     */
    async list(isAvailableQuery: string): Promise<IProduct[]> {
        const trx = await this.transactionManager.start();

        
        let isAvailable: boolean;
        if (isAvailableQuery === 'yes') {
            isAvailable = true;
        } else {
            isAvailable = false;
        }

        try {
            const products = await this.productRepo.listProducts(trx, isAvailable);

            await this.transactionManager.commit(trx);
            return products;
        } catch (error) {
            await this.transactionManager.rollback(trx);
            throw error;
        }
    }

    async create(product: IProduct, userId: string): Promise<IProduct> {
        const trx = await this.transactionManager.start();

        try {
            Object.assign(product, { seller_id: userId });

            const result = await this.productRepo.create(trx, product);

            await this.transactionManager.commit(trx);
            return result;
        } catch (error) {
            await this.transactionManager.rollback(trx);
            throw error;
        }
    }

    async finalizeOpenToBid(): Promise<void> {
        const trx = await this.transactionManager.start();

        try {
            const products = await this.productRepo.listOpenBidProducts(trx);

            if (products.length > 0) {
                for (const product of products) {
                    if (isProductTimeWindowInvalid(product.created_at, product.time_window)) {
                        // update product to not available and conclude last bid as winner
                        await Promise.all([
                            this.productRepo.update(trx, {
                                id: product.id,
                                is_available: false
                            }),
                            this.bidRepo.updateByProductId(trx, {
                                product_id: product.id,
                                status: 'BID_WON'
                            })
                        ]);    
                    }
                }
            }

            await this.transactionManager.commit(trx);
        } catch (error) {
            await this.transactionManager.rollback(trx);
            throw error;
        }
    }
}
