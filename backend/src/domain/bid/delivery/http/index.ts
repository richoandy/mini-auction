import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { IHttpDelivery } from 'util/delivery/http/interface';
import { ITransactionManager } from '../../../../util/transaction_manager/interface';
import { IBid, IBidUsecase } from '../../entity';

export default class BidHttpDelivery implements IHttpDelivery{
    private app: express.Express;
    private sessionMiddleware: express.RequestHandler;
    private bidUsecase: IBidUsecase;

    constructor(app: express.Express, sessionMiddleware: express.RequestHandler,bidUsecase: IBidUsecase) {
        this.app = app;
        this.sessionMiddleware = sessionMiddleware;
        this.bidUsecase = bidUsecase;
    }

    async loadHttpDelivery(): Promise<void> {
        this.app.post('/bid', this.sessionMiddleware, async (req, res) => {
            try {
                res.status(200).json(await this.bidUsecase.create(req.body, req.signedInUser.user_id));
            } catch (error) {
                console.log(error);
                switch (error.message) {
                    case 'PRODUCT_NOT_AVAILABLE': {
                        res.status(400).json({
                            error_code: error.message,
                            message: 'product is no longer available' 
                        })
                    }
                    break;
                    case 'EXPIRED_PRODUCT': {
                        res.status(400).json({
                            error_code: error.message,
                            message: "product is no longer available to bid"
                        });
                    }
                    break;
                    case 'SAME_PRICE': {
                        res.status(400).json({
                            error_code: error.message,
                            message: "price amount is invalid"
                        });
                    }
                    break;
                    case 'TOO_LOW_PRICE': {
                        res.status(400).json({
                            error_code: error.message,
                            message: "price amount is invalid"
                        });
                    }
                    break;
                    case 'INSUFFICIENT_BALANCE': {
                        res.status(400).json({
                            error_code: error.message,
                            message: "user balance is insufficient"
                        });
                    }
                    break;
                    case 'TIME_LOCKED_TO_BID': {
                        res.status(400).json({
                            error_code: error.message,
                            message: "user cannot bid now, wait for 15 seconds before making another bid"
                        });
                    }
                    break;
                    case 'FORBID_OWN_BID': {
                        res.status(400).json({
                            error_code: error.message,
                            message: "user cannot bid their own product"
                        });
                    }
                    break;
                } 
            }

        });
    }
}
