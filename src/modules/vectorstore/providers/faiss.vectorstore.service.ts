import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { IVectorStoreService } from "../interfaces/vectorstore.service.interface";
import { logger } from '../../../logger/logger';

export class FaissVectorStore implements IVectorStoreService {

    private embeddingModel: string;

    constructor() {
        this.embeddingModel = "text-embedding-ada-002";
    }


    createConnection = async () => {
        //method not applicable for FAISS
    };

    disconnect = async () => {
        //method not applicable for FAISS
    };

    createCollection = async (tenantId: string): Promise<string> => {
        return "Method Not Implemented for FAISS";
    };

    deleteCollection = async (tenantId: string): Promise<string> => {
        return "Method Not Implemented for FAISS";
    };

    deleteByFileName(fileName: string, tenantId: string) {
        // method not implemented for FAISS
    }

    refreshData(tenantId: string) {
        // method not implemented yet
    }

    insertData = async (tenantId: string, data: any): Promise<string> => {
        try {
            const vectorStore = await FaissStore.fromDocuments(
                data,
                new OpenAIEmbeddings({model: "text-embedding-ada-002"})
            );
            // const indexName = await this.clientIndex(clientName, projectName);
            const indexName = tenantId;
            const directory = `./localstore/${indexName}`;
            await vectorStore.save(directory);
            return "Faiss Vectorstore saved successfully";
        } catch (error) {
            logger.error(error);
            return "Error saving Faiss Vectorstore";
        }
    };

    clientIndex = async (clientName: string, projectName: string) => {
        return `${clientName}/${projectName}`;
    };

    loadVectorStore = async (tenantId: string, collectionName: string) => {
        // const indexName = this.clientIndex(clientName, projectName);
        const indexName = tenantId;
        const vectorStoreLocation = `./localstore/${indexName}`;
        const loadVectorStore = await FaissStore.load(
            vectorStoreLocation, 
            new OpenAIEmbeddings({model: this.embeddingModel})
        );
        return loadVectorStore;
    };

    similaritySearch = async (tenantId: string, userQuery: string) => {
        try {
            const vectorDB = await this.loadVectorStore(tenantId, "default");
            const k = 3;
            const similarDocs = await vectorDB.similaritySearch(userQuery, k);
            return similarDocs;
        } catch (error) {
            logger.error(error);
            return null;
        }
    };

}