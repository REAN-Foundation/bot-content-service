import { BlobServiceClient, ContainerClient, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import fs from 'fs';
import { Readable } from 'stream';
import { logger } from '../../../logger/logger';
import { IFileStorageService } from '../interfaces/file.storage.service.interface';

///////////////////////////////////////////////////////////////////////////////////

export class AzureStorageFileStorageService implements IFileStorageService {

    private blobServiceClient: BlobServiceClient;

    private containerClient: ContainerClient;

    // constructor() {
    //     this.initializeAzureClient();
    // }

    //#region Publics

    exists = async (storageKey: string): Promise<string> => {
        try {
            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const updatedStorageKey = storageKey.replace(`${containerName}/`, '');
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            const exists = await blobClient.exists();

            if (exists) {
                logger.info(`Blob ${storageKey} exists in Azure Storage`);
                return storageKey;
            }

            logger.info(`Blob ${storageKey} does not exist in Azure Storage`);
            return null;
        }
        catch (error) {
            logger.info(JSON.stringify(error, null, 2));
            return null;
        }
    };

    upload = async (storageKey: string, sourceFilePath: string): Promise<string> => {
        try {
            const fileContent = fs.readFileSync(sourceFilePath);
            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const updatedStorageKey = storageKey.replace(`${containerName}/`, '');
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            const blockBlobClient = blobClient.getBlockBlobClient();

            await blockBlobClient.upload(fileContent, fileContent.length);

            logger.info(`Successfully uploaded local file ${sourceFilePath} as ${storageKey} to Azure Storage`);
            return storageKey;
        }
        catch (error) {
            logger.info(error.message);
            throw error;
        }
    };

    uploadStream = async (storageKey: string, stream: Readable, contentType?: string): Promise<string> => {
        try {
            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const updatedStorageKey = storageKey.replace(`${containerName}/`, '');
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            const blockBlobClient = blobClient.getBlockBlobClient();

            const options: any = {};
            if (contentType) {
                options.blobHTTPHeaders = { blobContentType: contentType };
            }

            await blockBlobClient.uploadStream(stream, undefined, undefined, options);

            logger.info(`Successfully uploaded stream as ${storageKey} to Azure Storage`);
            return storageKey;
        }
        catch (error) {
            logger.info(error.message);
            throw error;
        }
    };

    download = async (storageKey: string, localFilePath: string): Promise<string> => {
        try {
            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const updatedStorageKey = storageKey.replace(`${containerName}/`, '');
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            const downloadResponse = await blobClient.download();

            const file = fs.createWriteStream(localFilePath);

            return new Promise((resolve, reject) => {
                downloadResponse.readableStreamBody
                    .on('end', () => {
                        const stats = fs.statSync(localFilePath);
                        let count = 0;
                        while (stats.size === 0 && count < 5) {
                            setTimeout(() => {
                                const newStats = fs.statSync(localFilePath);
                                if (newStats.size > 0) {
                                    resolve(localFilePath);
                                }
                            }, 3000);
                            count++;
                        }
                        resolve(localFilePath);
                    })
                    .on('error', (error) => {
                        reject(error);
                    })
                    .pipe(file);
            });
        }
        catch (error) {
            logger.info(error.message);
            throw error;
        }
    };

    downloadStream = async (storageKey: string): Promise<Readable> => {
        try {
            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const updatedStorageKey = storageKey.replace(`${containerName}/`, '');
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            const downloadResponse = await blobClient.download();

            if (downloadResponse.readableStreamBody) {
                // The Azure SDK returns a Node.js Readable stream, so we can return it directly
                return downloadResponse.readableStreamBody as Readable;
            } else {
                throw new Error('No readable stream body available');
            }
        }
        catch (error) {
            logger.info(error.message);
            throw error;
        }
    };

    rename = async (storageKey: string, newFileName: string): Promise<boolean> => {
        try {
            const s3Path = storageKey;
            const tokens = s3Path.split('/');
            const existingFileName = tokens[tokens.length - 1];
            const newPath = s3Path.replace(existingFileName, newFileName);

            if (newPath === s3Path) {
                throw new Error('Old and new file identifiers are same!');
            }

            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const updatedStorageKey = storageKey.replace(`${containerName}/`, '');
            const sourceBlobClient = this.containerClient.getBlobClient(updatedStorageKey);
            const destinationBlobClient = this.containerClient.getBlobClient(newPath);

            // Copy the blob to new location
            await destinationBlobClient.beginCopyFromURL(sourceBlobClient.url);

            // Delete the original blob
            await sourceBlobClient.delete();

            logger.info(`Successfully renamed ${storageKey} to ${newPath}`);
            return true;
        }
        catch (error) {
            logger.info(error.message);
            throw error;
        }
    };

    delete = async (storageKey: string): Promise<boolean> => {
        try {
            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const updatedStorageKey = storageKey.replace(`${containerName}/`, '');
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            await blobClient.delete();

            logger.info(`Successfully deleted ${storageKey} from Azure Storage`);
            return true;
        }
        catch (error) {
            logger.info(error.message);
            return false;
        }
    };

    getShareableLink = async (storageKey: string, durationInMinutes: number): Promise<string> => {
        try {
            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const updatedStorageKey = storageKey.replace(`${containerName}/`, '');
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            const sasToken = this.generateSasToken(storageKey, durationInMinutes);

            return `${blobClient.url}?${sasToken}`;
        }
        catch (error) {
            logger.info(error.message);
            return null;
        }
    };

    //#endregion

    //#region Privates

    private initializeAzureClient = (): void => {
        try {
            // Use connection string if available, otherwise use managed identity
            const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

            if (connectionString) {
                this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            } else {
                // Use managed identity or service principal
                const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
                if (!accountName) {
                    throw new Error('AZURE_STORAGE_ACCOUNT_NAME environment variable is required when not using connection string');
                }

                const credential = new DefaultAzureCredential();
                this.blobServiceClient = new BlobServiceClient(
                    `https://${accountName}.blob.core.windows.net`,
                    credential
                );
            }

            // const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'default';
            // this.containerClient = this.blobServiceClient.getContainerClient(containerName);

            logger.info('Azure Storage client initialized successfully');
        }
        catch (error) {
            logger.info(`Failed to initialize Azure Storage client: ${error.message}`);
            throw error;
        }
    };

    private generateSasToken = (storageKey: string, durationInMinutes: number): string => {
        try {
            this.initializeAzureClient();
            const containerName = storageKey.split('/')[0]; // Extract container name from storage key
            this.containerClient = this.blobServiceClient.getContainerClient(containerName);
            const updatedStorageKey = storageKey.replace(`${containerName}/`, '');
            const blobClient = this.containerClient.getBlobClient(updatedStorageKey);
            const blockBlobClient = blobClient.getBlockBlobClient();

            const startTime = new Date();
            const expiryTime = new Date(startTime.getTime() + (durationInMinutes * 60 * 1000));

            const permissions = BlobSASPermissions.parse("r"); // Read permission

            const sasToken = generateBlobSASQueryParameters(
                {
                    containerName : this.containerClient.containerName,
                    blobName      : storageKey,
                    permissions   : permissions,
                    startsOn      : startTime,
                    expiresOn     : expiryTime,
                },
                this.blobServiceClient.credential as any // Type assertion for credential
            );

            return sasToken.toString();
        }
        catch (error) {
            logger.info(`Failed to generate SAS token: ${error.message}`);
            // Fallback to a simple token format
            const startTime = new Date();
            const expiryTime = new Date(startTime.getTime() + (durationInMinutes * 60 * 1000));
            return `sv=2020-08-04&st=${startTime.toISOString()}&se=${expiryTime.toISOString()}&sr=b&sp=r`;
        }
    };

    //#endregion

}
