import * as pg from 'pg';

export class VectorstoreUtils {

    public static ensureDatabaseSchema = async(pool: pg.Pool, config) => {

        // This function creates a connection and checks if the table already exists.
        // If not it will be created with the vector extension on postgres tables.
        const client = await pool.connect();
        try {
            const query = `
            CREATE TABLE IF NOT EXISTS ${config.tableName} (
                ${config.columns.idColumnName} UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                ${config.columns.vectorColumnName} VECTOR,
                ${config.columns.contentColumnName} TEXT,
                ${config.columns.metadataColumnName} JSONB
            );
            `;
            await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
            await client.query('CREATE EXTENSION IF NOT EXISTS vector');
            await client.query(query);
        } finally {
            client.release();
        }
    };

    public static getAllIds = async (pool: pg.Pool, tableName: string) => {
        const client = await pool.connect();
        try {
            const query = `
            SELECT id FROM ${tableName};
            `;
            const idList = await client.query(query);
            return idList;
        } finally {
            client.release();
        }
    };
}