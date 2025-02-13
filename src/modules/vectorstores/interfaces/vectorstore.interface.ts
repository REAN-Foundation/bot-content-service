export interface IVectorStoreService {
    createConnection();
    disconnect();
    createCollection(tenantId: string);
    deleteCollection(tenantId: string);
    insertData(tenantId: string, data: any);
    refreshData(tenantId: string);
    clientIndex(clientName: string, projectName: string);
    loadVectorStore(clientName: string, projectName: string, collectionName: string);
    similaritySearch(tenantId: string, userQuery: string);
}

export interface IKeywordService {
    connectKeywordVectorStore();
    disconnectKeywordVectorStore();
    addKeywords(tenantId: string, tags: string[], fileName: string): Promise<string>;
    updateKeywords();
    deleteKeywords();
    searchKeywords(tenantId: string, userQuery: string);
}