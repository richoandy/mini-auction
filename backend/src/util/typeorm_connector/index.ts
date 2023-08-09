/**
 * ORM: TypeORM
 * docs: https://github.com/typeorm/typeorm
 */

import { DataSource, DataSourceOptions} from 'typeorm';

type dbConfigType = {
    host: string,
    port: number,
    database: string,
    username: string,
    password: string,
};

export default class TypeormConnector {
    private dbConfig: dbConfigType;
    public db: DataSource;

    constructor (dbConfig: dbConfigType) {
        this.dbConfig = dbConfig;
    }

    async initConnection (): Promise<void>  {

        this.db = new DataSource({
            ...this.dbConfig,
            type: 'postgres',
            synchronize: false,
            logging: true,
            entities: [
                `./src/domain/**/repository/model.ts`,
            ]
        })
    }

    async getConnection (): Promise<DataSource> {
        return this.db.initialize();
    }
}
