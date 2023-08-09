import * as express from 'express';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IHttpDelivery } from 'util/delivery/http/interface';
import { ITransactionManager } from '../../../../util/transaction_manager/interface';
import { IUser, IUserUsecase } from '../../entity';

export default class UserHttpDelivery implements IHttpDelivery{
    private app: express.Express;
    private userUsecase: IUserUsecase;
    private sessionMiddleware: RequestHandler;

    constructor (app: express.Express, sessionMiddleware: RequestHandler, userUsecase: IUserUsecase) {
        this.app = app;
        this.sessionMiddleware = sessionMiddleware;
        this.userUsecase = userUsecase;
    }

    async loadHttpDelivery (): Promise<void> {
        this.app.get('/user', this.sessionMiddleware, async (req, res) => {
            res.status(200).json(await this.userUsecase.getProfile({ id: req.signedInUser.user_id }));
        });
        
        this.app.post('/user/signup', async (req, res) => {
            try {
                res.json(await this.userUsecase.signUp(req.body));
            } catch (error) {
                switch (error.message) {
                    case 'EMAIL_IS_ALREADY_USED': {
                        res.status(400).json({
                            error_code: error.message,
                            message: 'email has been used'
                        })
                    }
                }
            }
        });

        this.app.post('/user/signin', async (req, res) => {
            try {
                res.status(200).json(await this.userUsecase.signIn(req.body))
            } catch (error) {
                switch (error.message) {
                    case 'PASSWORD_NOT_MATCH': {
                        res.status(400).json({
                            error_code: error.message,
                            message: "password does not match"
                        })
                    }
                }
            }
        });

        this.app.post('/user/deposit', async (req, res) => {
            try {
                res.status(200).json(await this.userUsecase.deposit({
                    id: req.body.id
                },
                req.body.amount
                ));
            } catch (error) {
                throw error;
            }
        });
    }
}
