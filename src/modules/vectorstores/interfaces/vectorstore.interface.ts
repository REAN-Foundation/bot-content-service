export interface IVectorStoreService {
    createConnection();
    disconnect();
    createCollection(clientName: string, projectName: string, collectionName: string);
    deleteCollection(clientName: string, projectName: string, collectionName: string);
    insertData(clientName: string, projectName: string, data: any);
    clientIndex(clientName: string, projectName: string);
    loadVectorStore(clientName: string, projectName: string, collectionName: string);
    similaritySearch(clientName: string, projectName: string, userQuery: string);
}