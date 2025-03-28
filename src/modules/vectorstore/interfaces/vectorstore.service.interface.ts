export interface IVectorStoreService {
    createConnection();
    disconnect();
    createCollection(tenantId: string);
    deleteCollection(tenantId: string);
    deleteByFileName(fileName: string, tenantId: string);
    insertData(tenantId: string, data: any);
    refreshData(tenantId: string);
    clientIndex(clientName: string, projectName: string);
    loadVectorStore(clientName: string, projectName: string, collectionName: string);
    similaritySearch(tenantId: string, userQuery: string, filter: any);
}