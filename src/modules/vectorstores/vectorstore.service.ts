import { IVectorStoreService } from '../../modules/vectorstores/interfaces/vectorstore.interface';
import { inject, injectable } from 'tsyringe';

///////////////////////////////////////////////////////////////////////////

@injectable()
export class VectorstoreService {

    constructor(@inject('IVectorstoreService') private _vectorstoreService: IVectorStoreService) {

    }

    createConnection = async () => {
        return await this._vectorstoreService.createConnection();
    };

    disconnect = async () => {
        return await this._vectorstoreService.disconnect();
    };

    createCollection = async (tenantId: string) => {
        return await this._vectorstoreService.createCollection(tenantId);
    };

    deleteCollection = async (tenantId: string) => {
        return await this._vectorstoreService.deleteCollection(tenantId);
    };

    insertData = async (tenantId: string, data: any) => {
        return await this._vectorstoreService.insertData(tenantId, data);
    };

    refreshData = async (tenantId: string) => {
        return await this._vectorstoreService.refreshData(tenantId);
    };

    clientIndex = async (clientName: string, projectName: string) => {
        return await this._vectorstoreService.clientIndex(clientName, projectName);
    };

    loadVectorStore = async (documents: any, clientName: string, projectName: string, collectionName: string) => {
        return await this._vectorstoreService.loadVectorStore(clientName, projectName, collectionName);
    };

    similaritySearch = async (tenantId: string, userQuery: string) => {
        return await this._vectorstoreService.similaritySearch(tenantId, userQuery);
    };
}