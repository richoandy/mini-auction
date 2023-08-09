import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { IHttpDelivery } from 'util/delivery/http/interface';
import { ITransactionManager } from '../../../../util/transaction_manager/interface';
import {IProduct, IProductUsecase } from '../../entity';

export default class ProductHttpDelivery implements IHttpDelivery{
    private app: express.Express;
    private sessionMiddleware: express.RequestHandler;
    private productUsercase: IProductUsecase;

    constructor(app: express.Express, sessionMiddleware: express.RequestHandler, productUsecase: IProductUsecase) {
        this.app = app;
        this.sessionMiddleware = sessionMiddleware;
        this.productUsercase = productUsecase;
    }

    async loadHttpDelivery(): Promise<void> {
        this.app.get('/product', this.sessionMiddleware, async (req, res) => {
            res.status(200).json(await this.productUsercase.list(String(req.query.online_product_only)));
        });

        this.app.post('/product', this.sessionMiddleware, async (req, res) => {
            res.status(200).json(await this.productUsercase.create(req.body, req.signedInUser.user_id));
        });

        // need specific authentication/session middleware to identify cron job
        this.app.post('/product/close-the-bids', async (req, res) => {
            res.status(200).json(await this.productUsercase.finalizeOpenToBid());
        })
    }
}
