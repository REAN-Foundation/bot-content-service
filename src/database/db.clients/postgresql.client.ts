import { Client } from 'pg';
import { logger } from '../../logger/logger';
import { Config } from '../database.config';

////////////////////////////////////////////////////////////////

export class PostgresqlClient {

    public createDb = async () => {
        try {
            const query = `CREATE DATABASE ${Config.database}`;
            console.log(`[INIT] Attempting to create Postgres database: ${Config.database}`);
            await this.executeQuery(query);
            console.log(`[INIT] Postgres database created: ${Config.database}`);
            logger.info(`Database ${Config.database} created successfully!`);
        } catch (error) {
            console.log(`[INIT] createDb skipped (database likely already exists): ${error.message}`);
            logger.error(error.message);
        }
    };

    public dropDb = async () => {
        try {
            const query = `DROP DATABASE IF EXISTS ${Config.database}`;
            await this.executeQuery(query);
        } catch (error) {
            logger.error(error.message);
        }
    };

    public executeQuery = async (query): Promise<unknown> => {
        const client = new Client({
            user     : Config.username,
            host     : Config.host,
            password : Config.password,
            port     : Config.port,
            database : 'postgres',
        });
        try {
            await client.connect();
            const result = await client.query(query);
            return result;
        } finally {
            await client.end();
        }
    };

}
