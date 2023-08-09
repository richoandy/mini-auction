/**
 * stand-alone app specifically written to run typeorm based migrations
 * run "npm run migration:up" / "npm run migration:down"
 */

import * as dotenv from 'dotenv'; dotenv.config();
import { DataSourceOptions, DataSource } from 'typeorm';

// Config
import config from '../src/config';


function getConfig() {
    return {
        type: 'postgres',
        host: config.DATABASE.HOST,
        port: parseInt(config.DATABASE.PORT, 10),
        username: config.DATABASE.USERNAME,
        password: config.DATABASE.PASSWORD,
        database: config.DATABASE.NAME,
        synchronize: false,
        migrations: [__dirname + '/scripts/*.{ts,js}'],
    } as DataSourceOptions;
}

const datasource = new DataSource(getConfig());

datasource.initialize();
export default datasource;