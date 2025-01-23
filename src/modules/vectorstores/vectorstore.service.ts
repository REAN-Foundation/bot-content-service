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

    createCollection = async (clientName: string, projectName: string, collectionName: string) => {
        return await this._vectorstoreService.createCollection(clientName, projectName, collectionName);
    };

    deleteCollection = async (clientName: string, projectName:string, collectionName: string) => {
        return await this._vectorstoreService.deleteCollection(clientName, projectName, collectionName);
    };

    insertData = async (tenantId: string, data: any) => {
        return await this._vectorstoreService.insertData(tenantId, data);
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