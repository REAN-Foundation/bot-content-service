import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import { IVectorStoreService } from "../interfaces/vectorstore.interface";

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

    createCollection = async (clientName: string, projectName: string, collectionName: string): Promise<string> => {
        return "Method Not Implemented for FAISS";
    };

    deleteCollection = async (clientName: string, projectName: string, collectionName: string): Promise<string> => {
        return "Method Not Implemented for FAISS";
    };

    insertData = async (clientName: string, projectName: string, data: any): Promise<string> => {
        try {
            const vectorStore = await FaissStore.fromDocuments(
                data,
                new OpenAIEmbeddings({model: "text-embedding-ada-002"})
            );
            const indexName = await this.clientIndex(clientName, projectName);
            const directory = `./localstore/${indexName}`;
            await vectorStore.save(directory);
            return "Faiss Vectorstore saved successfully";
        } catch (error) {
            return "Error saving Faiss Vectorstore";
        }
    };

    clientIndex = async (clientName: string, projectName: string) => {
        return `${clientName}/${projectName}`;
    };

    loadVectorStore = async (clientName: string, projectName: string, collectionName: string) => {
        const indexName = this.clientIndex(clientName, projectName);
        const vectorStoreLocation = `./localstore/${indexName}`;
        const loadVectorStore = await FaissStore.load(
            vectorStoreLocation, 
            new OpenAIEmbeddings({model: this.embeddingModel})
        );
        return loadVectorStore;
    };

    similaritySearch = async (clientName: string, projectName: string, userQuery: string) => {
        const vectorDB = await this.loadVectorStore(clientName, projectName, "default");
        const k = 3;
        const similarDocs = await vectorDB.similaritySearch(userQuery, k);
        return similarDocs;
    };

}