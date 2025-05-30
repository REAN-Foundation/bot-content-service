import { PGVectorStore, DistanceStrategy } from "@langchain/community/vectorstores/pgvector";
import { OpenAIEmbeddings } from "@langchain/openai";
import { IVectorStoreService } from "../interfaces/vectorstore.service.interface";
import { VectorstoreUtils } from "../../../common/utilities/vectorstore.utils";
import { logger } from "../../../logger/logger";
import { PoolConfig, Pool } from "pg";
import * as pg from 'pg';

export class PgVectorStore implements IVectorStoreService {

    private embeddingModel: string;

    private _pgConnection;

    private pool: pg.Pool;
    
    private tenantId;
    
    private tableName;

    constructor() {
        this.embeddingModel = "text-embedding-ada-002";
    }
    
    createConnection = async () => {
        const embeddings = new OpenAIEmbeddings({model: this.embeddingModel});

        // Creating the configuration for the pgvector database
        const config = {
            postgresConnectionOptions : {
                type     : "postgres",
                host     : process.env.PG_HOST,
                port     : process.env.PG_PORT,
                user     : process.env.PG_USER,
                password : process.env.PG_PASSWORD,
                databse  : process.env.PG_DATABASE
            } as PoolConfig,
            tableName : this.tenantId + '_' + process.env.NODE_ENV,
            columns   : {
                idColumnName       : "id",
                vectorColumnName   : "vector",
                contentColumnName  : "content",
                metadataColumnName : "metadata",
            },
            distanceStrategy : "cosine" as DistanceStrategy,
        };

        const { postgresConnectionOptions, tableName, columns, distanceStrategy } = config;
        this.tableName = tableName;
        this.pool = new pg.Pool(postgresConnectionOptions);
        await VectorstoreUtils.ensureDatabaseSchema(this.pool, config);
        const pgVectorConfig = {
            pool : this.pool,
            tableName,
            columns,
            distanceStrategy
        };

        // This will create a connection to the pgvector store table in the database
        this._pgConnection = new PGVectorStore(embeddings, pgVectorConfig);
    };

    disconnect() {
        //method not implemented
    }

    createCollection(tenantId: string) {
        //method does not exist for pgvector
    }

    deleteCollection = async (tenantId: string): Promise<string> => {
        try {
            this.tenantId = tenantId;
            await this.createConnection();
            const idList = await VectorstoreUtils.getAllIds(this.pool, this.tableName);
            const ids = idList.rows.map(row => row.id);
            await this._pgConnection.delete({ ids });
            return "deleted";
        } catch (error) {
            logger.error(error);
            throw new Error("Unable to delete the vectorstore entries");
        }

    };

    deleteByFileName = async (fileName: string, tenantId: string): Promise<string> => {
        try {
            this.tenantId = tenantId;
            await this.createConnection();
            const idList = await VectorstoreUtils.getIdsByFileName(this.pool, this.tableName, fileName);
            const ids = idList.rows.map(row => row.id);
            await this._pgConnection.delete({ ids });
            return "deleted";
        } catch (error) {
            logger.error(error);
            throw new Error("Unable to delete the vectorstore entries");
        }
    };

    refreshData = async (tenantId: string): Promise<string> => {
        try {

            await this.deleteCollection(tenantId);

            await this.createCollection(tenantId);

            return "PG VECTOR CLEARED";
        } catch (error) {
            logger.error(error);
            throw new Error("Unable to delete the vectorstore");
        }
    };

    insertData = async (tenantId: string, data: any): Promise<string> => {
        try {
            this.tenantId = tenantId;
            await this.createConnection();
            await this._pgConnection.addDocuments(data);
            return "Documents added successfully";
        } catch (error) {
            logger.error(error);
            throw new Error("Unable to add documents to pgvector");
        }
    };

    clientIndex = async (tenantId: string) => {
        const env = process.env.ENVIRONMENT;
        return `${env}-${tenantId}`;
    };

    loadVectorStore(clientName: string, projectName: string, collectionName: string) {
        // method not implemented yet;
    }

    similaritySearch = async (tenantId: string, userQuery: string, filter: any) => {
        try {
            this.tenantId = tenantId;
            await this.createConnection();
            const k = 3;
            let similaritySearch = await this._pgConnection.similaritySearchWithScore(
                userQuery,
                k + 2,
                filter
            );

            if (!similaritySearch.some(([_ , score]) => score <= 0.20)) {
                similaritySearch = await this._pgConnection.similaritySearch(
                    userQuery,
                    k
                );
            } else {
                similaritySearch = similaritySearch.map(([doc, _ ]) => doc);
            }
            return similaritySearch;
        } catch (error) {
            logger.error(error);
            throw new Error("Issue while fetching the similar documents");
        }
    };
}