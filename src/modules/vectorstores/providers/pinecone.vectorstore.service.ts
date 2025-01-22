import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { IVectorStoreService } from "../interfaces/vectorstore.interface";

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

    createCollection(clientName: string, projectName: string, collectionName: string) {
        //method does not exist for pinecone
    }

    deleteCollection(clientName: string, projectName: string, collectionName: string) {
        //method does not exist for pinecone
    }

    insertData = async (tenantId: string, data: any): Promise<string> => {
        try {
            const vectorStore = await this.loadVectorStore(tenantId, "default");
            await vectorStore.addDocuments(data);
            return "Docuemnts added successfully";
        } catch (error) {
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

    similaritySearch = async (tenantId: string, userQuery: string) => {
        const k = 3;
        const filter = {};
        // CHANGE THIS BELOW LINE
        const vectorDB = await this.loadVectorStore("", "default");
        const similaritySearch = vectorDB.similaritySearch(
            userQuery,
            k,
        );
        return similaritySearch;
    };
}
