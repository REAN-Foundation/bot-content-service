// import { Loader } from '../../startup/loader';
import { IFileStorageService } from '../../modules/storage/interfaces/file.storage.service.interface';
import { inject, injectable } from 'tsyringe';
import { CustomFileStorageService } from './providers/custom.file.storage.service';

///////////////////////////////////////////////////////////////////////////////////////
@injectable()
export class StorageService {

    _storageService: IFileStorageService = null;
    // constructor( @inject('IFileStorageService') private _storageService: IFileStorageService ) {
    
    // }

    constructor () {
        this._storageService = new CustomFileStorageService();

    }

    exists = async (storageKey: string): Promise<string> => {
        return await this._storageService.exists(storageKey);
    };
    
    upload = async (storageKey: string, inputStream): Promise<string|null|undefined> => {
        return await this._storageService.upload(storageKey, inputStream);
    };
    
    download = async (storageKey: string, localFilePath?: string): Promise<any> => {
        return await this._storageService.download(storageKey,  localFilePath);
    };
    
    // uploadLocally = async (storageKey: string, localFilePath?: string): Promise<string|null|undefined> => {
    //     return await this._storageService.uploadLocally(storageKey, localFilePath);
    // };
    
    // downloadLocally = async (storageKey: string, localFilePath?: string): Promise<string> => {
    //     return await this._storageService.downloadLocally(storageKey, localFilePath);
    // };

    rename = async (existingStorageKey: string, newFileName: string): Promise<boolean> => {
        return await this._storageService.rename(existingStorageKey, newFileName);
    };

    getShareableLink = async (storageKey: string, durationInMinutes: number): Promise<string> => {
        return await this._storageService.getShareableLink(storageKey, durationInMinutes);
    };

    delete = async (storageKey: string): Promise<boolean> => {
        return await this._storageService.delete(storageKey);
    };

}
