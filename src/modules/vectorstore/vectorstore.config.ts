import { PoolConfig } from 'pg';

///////////////////////////////////////////////////////////////////////////

export const getVectorStorePoolConfig = (): PoolConfig => ({
    type     : 'postgres',
    host     : process.env.PG_HOST,
    port     : process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
    user     : process.env.PG_USER,
    password : process.env.PG_PASSWORD,
    database : process.env.PG_DATABASE,
    ssl      : process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
} as PoolConfig);
