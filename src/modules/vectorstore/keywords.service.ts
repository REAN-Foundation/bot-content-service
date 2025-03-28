import { IKeywordsService } from "./interfaces/keywords.service.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class KeywordsService {

    constructor(@inject('IKeywordsService') private _keywordsService: IKeywordsService) {

    }

    connectKeywordVectorStore = async () => {
        return await this._keywordsService.connectKeywordVectorStore();
    };

    disconnectKeywordVectorStore = async () => {
        return await this._keywordsService.disconnectKeywordVectorStore();
    };

    addKeywords = async (tenantId: string, tags: string[], fileName: string) => {
        return await this._keywordsService.addKeywords(tenantId, tags, fileName);
    };

    updateKeywords = async () => {
        return await this._keywordsService.updateKeywords();
    };

    deleteKeywords = async () => {
        return await this._keywordsService.deleteKeywords();
    };

    searchKeywords = async (tenantId: string, userQuery: string) => {
        return await this._keywordsService.searchKeywords(tenantId, userQuery);
    };
}