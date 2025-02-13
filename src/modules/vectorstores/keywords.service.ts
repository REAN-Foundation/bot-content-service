import { IKeywordService } from "./interfaces/vectorstore.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class KeywordService {

    constructor(@inject('IKeywordService') private _keywordService: IKeywordService) {

    }

    connectKeywordVectorStore = async () => {
        return await this._keywordService.connectKeywordVectorStore();
    };

    disconnectKeywordVectorStore = async () => {
        return await this._keywordService.disconnectKeywordVectorStore();
    };

    addKeywords = async (tenantId: string, tags: string[], fileName: string) => {
        return await this._keywordService.addKeywords(tenantId, tags, fileName);
    };

    updateKeywords = async () => {
        return await this._keywordService.updateKeywords();
    };

    deleteKeywords = async () => {
        return await this._keywordService.deleteKeywords();
    };

    searchKeywords = async (tenantId: string, userQuery: string) => {
        return await this._keywordService.searchKeywords(tenantId, userQuery);
    };
}