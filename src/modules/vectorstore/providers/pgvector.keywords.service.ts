import { PGVectorStore, DistanceStrategy } from "@langchain/community/vectorstores/pgvector";
import { OpenAIEmbeddings } from "@langchain/openai";
import { IKeywordsService } from "../interfaces/keywords.service.interface";
import { VectorstoreUtils } from "../../../common/utilities/vectorstore.utils";
import { Document } from "@langchain/core/documents";
import { logger } from "../../../logger/logger";
import { PoolConfig } from 'pg';
import * as pg from 'pg';

export class PgKeywordsService implements IKeywordsService {

    private tenantId: string;

    private pool: pg.Pool;

    private _pgConnection;

    connectKeywordVectorStore = async () => {
        const embeddings = new OpenAIEmbeddings({model: "text-embedding-ada-002"});

        const config = {
            postgresConnectionOptions : {
                type     : "postgres",
                host     : process.env.PG_HOST,
                port     : process.env.PG_PORT,
                user     : process.env.PG_USER,
                password : process.env.PG_PASSWORD,
                database : process.env.PG_DATABASE
            } as PoolConfig,
            tableName : this.tenantId + '_keywords_' + process.env.NODE_ENV,
            columns   : {
                idColumnName       : "id",
                vectorColumnName   : "vector",
                contentColumnName  : "content",
                metadataColumnName : "metadata"
            },
            distanceStrategy : "cosine" as DistanceStrategy,
        };

        const { postgresConnectionOptions, tableName, columns, distanceStrategy } = config;
        this.pool = new pg.Pool(postgresConnectionOptions);
        await VectorstoreUtils.ensureDatabaseSchema(this.pool, config);
        const pgVectorConfig = {
            pool : this.pool,
            tableName,
            columns,
            distanceStrategy
        };

        this._pgConnection = new PGVectorStore(embeddings, pgVectorConfig);
    };

    disconnectKeywordVectorStore() {
        // method to be implemented
    }

    addKeywords = async (tenantId, tags, fileName): Promise<string>  =>{
        try {
            const final_documents = [];
            if (tags.length !== 0) {
                for (let i = 0; i < tags.length; i++) {
                    final_documents.push(
                        new Document({
                            pageContent : tags[i],
                            metadata    : {
                                "fileName" : fileName
                            }
                        })
                    );
                }
                this.tenantId = tenantId;
                await this.connectKeywordVectorStore();
                await this._pgConnection.addDocuments(final_documents);
                return "Keywords added successfully";
            } else {
                return "NO KEYWORDS";
            }
        } catch (error) {
            logger.error(error);
            throw new Error("Unable to add keywords");
        }
    };

    deleteKeywords() {
        // method to be implemented
    }

    updateKeywords() {
        //method to be implemented
    }

    searchKeywords = async(tenantId, userQuery) => {
        try {
            this.tenantId = tenantId;
            await this.connectKeywordVectorStore();
            const k = 3;
            const similarKeywords = await this._pgConnection.similaritySearchWithScore(
                userQuery,
                k,
            );
            const filteredResults = similarKeywords.filter(([_, score]) => score <= 0.20).sort((a,b) => b[1] - a[1]);
            const finalKeywords = filteredResults.map(([doc, _]) => doc);
            return finalKeywords;
        } catch (error) {
            logger.error(error);
            throw new Error("Issue while fetching similar keywords");
        }
    };
}