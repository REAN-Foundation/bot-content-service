import { Stream } from "stream";
import { Readable } from "stream";

export interface IFileStorageService {

    exists(storageKey: string): Promise<string>;

    upload(storageKey: string, sourceFilePath: string): Promise<string>;

    uploadStream(storageKey: string, stream, contentType?: string): Promise<string>;

    download(storageKey: string, localFilePath: string): Promise<string>;

    downloadStream(storageKey: string): Promise<Readable>;

    rename(existingStorageKey: string, newFileName: string): Promise<boolean>;

    getShareableLink(storageKey: string, durationInMinutes: number): Promise<string>;

    delete(storageKey: string): Promise<boolean>;
}
// export interface IFileStorageService {

//     exists(storageKey: string): Promise<string>;
    
//     upload(storageKey: string, inputStream): Promise<string|null|undefined>;
    
//     download(storageKey: string, localFilePath: string): Promise<any>;
    
//     uploadLocally(storageKey: string, localFilePath?: string): Promise<string|null|undefined>;
    
//     downloadLocally(storageKey: string, localFilePath: string): Promise<string>;

//     rename(existingStorageKey: string, newFileName: string): Promise<boolean>;

//     getShareableLink(storageKey: string, durationInMinutes: number): Promise<string>;

//     delete(storageKey: string): Promise<boolean>;
// }
