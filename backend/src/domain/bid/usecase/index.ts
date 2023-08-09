import * as jwt from 'jsonwebtoken';
import { QueryRunner } from 'typeorm';
import { ITransactionManager } from 'util/transaction_manager/interface';
import { IBidUsecase, IBidRepo, IBid } from '../entity';
import { IEncryptor } from 'util/encryptor/interface';
import { IBalanceHistoryRepo } from '../../balance_history/entity';
import { IProductRepo } from 'domain/product/entity';
import { isTimeWindowProductValid, isPriceValid, isUserBalanceEnough, isEligibleToBidNow, isBiddingOwnProduct, sortRefundPaymentPerBidder } from './helper';
import { IUser, IUserRepo } from 'domain/user/entity';

export default class bidUsecase implements IBidUsecase {
    private bidRepo: IBidRepo;
    private balanceHistoryRepo: IBalanceHistoryRepo;
    private productRepo: IProductRepo;
    private userRepo: IUserRepo;
    private transactionManager: ITransactionManager<any>;

    constructor(transactionManager: ITransactionManager<any>, bidRepo: IBidRepo, balanceHistoryRepo: IBalanceHistoryRepo, productRepo: IProductRepo, userRepo: IUserRepo) {
        this.bidRepo = bidRepo;
        this.balanceHistoryRepo = balanceHistoryRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.transactionManager = transactionManager;
    }

    async create(bid: IBid, bidderId: string): Promise<IBid> {
        const trx = await this.transactionManager.start();

        try {
            const [bidder, product] = await Promise.all([
                this.userRepo.findById(trx, { id: bidderId }),
                this.productRepo.findById(trx, { id: bid.product_id })
            ]);

            isBiddingOwnProduct(bidderId, product.seller_id);
            
            isEligibleToBidNow(bidder.last_bid_at, new Date());

            isUserBalanceEnough(bidder.balance, bid.price);

            // check product is still available
            if (!product.is_available) {
                throw new Error('PRODUCT_NOT_AVAILABLE');
            }

            // check if price submitted is a valid
            isPriceValid(product.current_price, bid.price);

            // check if product's time period is still valid
            isTimeWindowProductValid(product.created_at, product.time_window);

            // find previous bids related to this product with status ON_GOING
            const ongoingBids = await this.bidRepo.list(trx, 'ON_GOING', bid.product_id);

            if (ongoingBids.length > 0) {
                for (const ongoingBid of ongoingBids) {
                    // find user
                    const refundBidder = await this.userRepo.findById(trx, {
                        id: ongoingBid.bidder_id
                    });

                    await Promise.all([
                        // refund previous bidder's payment
                        this.userRepo.update(trx, {
                            id: ongoingBid.bidder_id,
                            balance: Number(refundBidder.balance) + Number(ongoingBid.price)
                        }),

                        // create new balance history for previous bidder's payment
                        this.balanceHistoryRepo.create(trx, {
                            user_id: ongoingBid.bidder_id,
                            bid_id: ongoingBid.id,
                            type: 'REFUND',
                            amount: ongoingBid.price,
                            previous_balance: refundBidder.balance,
                            updated_balance: refundBidder.balance + ongoingBid.price
                        }),

                        this.bidRepo.update(trx, {    
                            id: ongoingBid.id,
                            status: 'REFUNDED'
                        }),
                    ]);
                }
            }

            // re-fetch bidder/user info
            const updatedBidder = await this.userRepo.findById(trx, { id: bidderId });

            // create new bid
            const createBidPromise = this.bidRepo.create(trx, {
                bidder_id: bidderId,
                product_id: bid.product_id,
                price: bid.price,
                status: 'ON_GOING',
                }
            );

            // deduct bidder's balance
            const updateUserAndBalancePromise = this.userRepo.update(trx, {
                id: bidder.id,
                balance: updatedBidder.balance - bid.price,
                last_bid_at: new Date()
            });


            // update product's status
            const updateProductPromise = this.productRepo.update(trx, {
                id: bid.product_id,
                current_price: bid.price
            });

            const [createdBid] = await Promise.all([
                createBidPromise,
                updateUserAndBalancePromise,
                updateProductPromise
            ]);

            // create new balance history for bidder's bid payment
            await this.balanceHistoryRepo.create(trx, {
                user_id: bidderId,
                type: 'PAYMENT',
                amount: bid.price,
                previous_balance: updatedBidder.balance,
                updated_balance: updatedBidder.balance - bid.price,
                bid_id: createdBid.id
            });

            await this.transactionManager.commit(trx);
            return createdBid;
        } catch (error) {
            console.log(error);    
            await this.transactionManager.rollback(trx);
            throw error;
        }
    }
}
