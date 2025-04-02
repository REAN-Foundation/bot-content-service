import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { IVectorStoreService } from "../interfaces/vectorstore.service.interface";
import { logger } from '../../../logger/logger';

export class PineconeVectorStore implements IVectorStoreService {

    private embeddingModel: string;

    private _pcConnection;

    constructor(){
        this.embeddingModel = "text-embedding-ada-002";
    }

    createConnection = async() => {
        
        // env variables to be set PINECONE_API_KEY and PINECONE_ENVIRONMENT
        this._pcConnection = new PineconeClient();
    };

    disconnect() {
        //method not implemented
    }

    createCollection(tenantId: string) {
        //method does not exist for pinecone
    }

    deleteCollection(tenantId: string) {
        //method does not exist for pinecone
    }

    deleteByFileName(fileName: string, tenantId: string) {
        // method not implemented yet for pinecone
    }

    refreshData(tenantId: string) {
        //method not implemented yet
    }

    insertData = async (tenantId: string, data: any): Promise<string> => {
        try {
            const vectorStore = await this.loadVectorStore(tenantId, "default");
            await vectorStore.addDocuments(data);
            return "Docuemnts added successfully";
        } catch (error) {
            logger.error(error);
            return error.message;
        }
    };

    clientIndex = async (tenantId: string) => {
        const env = process.env.ENVIRONMENT;
        return `${env}-${tenantId}`;
    };

    loadVectorStore = async (tenantId: string, collectionName: string) => {

        await this.createConnection();
        // const pineconeIndex = await this.clientIndex(clientName, projectName);
        const pineconeIndex = this._pcConnection.Index(process.env.PINECONE_INDEX);
        const embeddings = new OpenAIEmbeddings({model: this.embeddingModel});
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
            maxConcurrency : 5,
        });
        return vectorStore;
    };

    similaritySearch = async (tenantId: string, userQuery: string, filter: any) => {
        const k = 3;
        // CHANGE THIS BELOW LINE
        const vectorDB = await this.loadVectorStore("", "default");
        const similaritySearch = vectorDB.similaritySearch(
            userQuery,
            k,
        );
        return similaritySearch;
    };
}
