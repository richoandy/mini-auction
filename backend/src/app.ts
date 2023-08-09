// Config
import { join } from 'path';
import * as dotenv from 'dotenv'; dotenv.config();
import config from './config';

// external libraries
import * as express from 'express';
import 'reflect-metadata'; // dependency for typeORM
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt'
import * as cors from 'cors';
import * as OpenApiValidator from 'express-openapi-validator';

// Connector
import TypeormConnector from './util/typeorm_connector';

// internal libraries
import TransactionManager from './util/transaction_manager';
import Encryptor from './util/encryptor';
import { jwtMiddleware as sessionMiddleware } from './util/express_custom_middlewares/session_validator';

// User Domain
import UserRepo from './domain/user/repository';
import UserUsecase from './domain/user/usecase';
import UserHttpDelivery from './domain/user/delivery/http';

// Product Domain
import ProductRepo from './domain/product/repository';
import ProductUsecase from './domain/product/usecase';
import ProductHttpDelivery from './domain/product/delivery/http';
import BalanceHistoryRepo from './domain/balance_history/repository';

// Bid Domain
import BidRepo from './domain/bid/repository';
import BidUsecase from './domain/bid/usecase';
import BidHttpDelivery from './domain/bid/delivery/http';

(async () => {
    // initialize typeORM connection to mysql database
    const typeormConnector = new TypeormConnector({
        host: config.DATABASE.HOST,
        port: parseInt(config.DATABASE.PORT, 10),
        username: config.DATABASE.USERNAME,
        password: config.DATABASE.PASSWORD,
        database: config.DATABASE.NAME,
    });

    // connect to postrgresql Database with typeorm
    await typeormConnector.initConnection();
    const dbConnection: DataSource = await typeormConnector.getConnection();

    // initialize TransactionManager with Typeorm Implementation
    const transactionManager = new TransactionManager(dbConnection);

    // initialize encryptor library for signIn/signUp usecases
    const encryptor = new Encryptor(bcrypt, 10);

    // Prepare Express Server
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    // Express middleware for OpenAPI request validation
    /**
     * UNCOMMENT ONCE ALL ENDPOINTS ADDED TO OPENAPI.YAML 
    */

    // app.use(
    //     OpenApiValidator.middleware({
    //       apiSpec: './openapi.yaml'
    //     }),
    // );

    // app.use((err, req, res, next) => {
    //     // format error
    //     res.status(err.status || 500).json({
    //         message: err.message,
    //         errors: err.errors,
    //     });
    // });

    const userRepo = new UserRepo(dbConnection);
    const productRepo = new ProductRepo(dbConnection);
    const bidRepo = new BidRepo(dbConnection);
    const balanceHistoryRepo = new BalanceHistoryRepo(dbConnection);

    const userUsecase = new UserUsecase(transactionManager, userRepo, encryptor, balanceHistoryRepo);
    const productUsecase = new ProductUsecase(transactionManager, productRepo, userRepo, bidRepo);
    const bidUsecase = new BidUsecase(transactionManager, bidRepo, balanceHistoryRepo, productRepo, userRepo);

    const userHttpDelivery = new UserHttpDelivery(app, sessionMiddleware, userUsecase);
    const productHttpDelivery = new ProductHttpDelivery(app, sessionMiddleware, productUsecase);
    const bidHttpDelivery = new BidHttpDelivery(app, sessionMiddleware, bidUsecase);

    // // load HTTP delivery
    await Promise.all([
        userHttpDelivery.loadHttpDelivery(),
        productHttpDelivery.loadHttpDelivery(),
        bidHttpDelivery.loadHttpDelivery(),
    ]);

    // Start Express Server
    app.listen(parseInt(config.APP.PORT, 10));
    console.log("Express is listening to port", config.APP.PORT);
})();
