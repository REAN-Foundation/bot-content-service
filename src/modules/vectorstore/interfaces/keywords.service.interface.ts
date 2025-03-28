export interface IKeywordsService {
    connectKeywordVectorStore();
    disconnectKeywordVectorStore();
    addKeywords(tenantId: string, tags: string[], fileName: string): Promise<string>;
    updateKeywords();
    deleteKeywords();
    searchKeywords(tenantId: string, userQuery: string);
}