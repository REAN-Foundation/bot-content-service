/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import fs from 'fs';
import path from 'path';
import * as asyncLib from 'async';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { VectorstoreService } from '../../modules/vectorstore/vectorstore.service';
import { KeywordsService } from '../../modules/vectorstore/keywords.service';
import { VectorStoreValidator } from './vectorstore.validator';
import { Loader } from '../../startup/loader';
import { DocumentProcessor } from '../../modules/document.processors/document.processor';
import { VectorStoreCreateModel, VectorStoreSearchModel } from '../../domain.types/vectorstores/vectorstore.domain.type';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { FileResourceService } from '../../database/services/file.resource/file.resource.service';
import * as mime from 'mime-types';
import { ConfigurationManager } from '../../config/configuration.manager';
import { StorageService } from '../../modules/storage/storage.service';
import { QnaDocumentService } from '../../database/services/content/qna.document.service';

///////////////////////////////////////////////////////////////////////////////

interface PublishTask {
    tenantId: string;
    records: any[];
}

interface RefreshTask {
    tenantId: string;
}

const PUBLISH_QUEUE_CONCURRENCY = 2;
const REFRESH_QUEUE_CONCURRENCY = 2;

export class VectorstoreController {

    _vectorstoreService: VectorstoreService = Loader.Container.resolve(VectorstoreService);

    _keywordsService: KeywordsService = Loader.Container.resolve(KeywordsService);

    _fileResourceService: FileResourceService = new FileResourceService();

    _qnaDocumentService: QnaDocumentService = new QnaDocumentService();

    _storageService: StorageService = Loader.Container.resolve(StorageService);

    _validator: VectorStoreValidator = new VectorStoreValidator();

    private _documentProcessor = new DocumentProcessor();

    private _publishQueue = asyncLib.queue((task: PublishTask, onCompleted) => {
        (async () => {
            try {
                await this.processPublishAll(task.tenantId, task.records);
            } catch (error) {
                console.error(`Error in publish queue for tenant ${task.tenantId}:`, error);
            } finally {
                onCompleted();
            }
        })();
    }, PUBLISH_QUEUE_CONCURRENCY);

    private _refreshQueue = asyncLib.queue((task: RefreshTask, onCompleted) => {
        (async () => {
            try {
                await this.processRefreshAll(task.tenantId);
            } catch (error) {
                console.error(`Error in refresh queue for tenant ${task.tenantId}:`, error);
            } finally {
                onCompleted();
            }
        })();
    }, REFRESH_QUEUE_CONCURRENCY);

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: VectorStoreCreateModel = await this._validator.validateCreateRequest(request);
            const tenantId = model.TenantId;
            const records = await this._fileResourceService.getByTenantId(tenantId);
            if (!records || records.length === 0) {
                ErrorHandler.throwNotFoundError('Files do not exist to create vectorstore.');
            }

            ResponseHandler.success(request, response, 'Your document is publishing. This may take a few moments.', 200, '');

            this.enqueuePublishTask({
                tenantId,
                records
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: VectorStoreCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._fileResourceService.getById(model.id);
            const tenantId = model.TenantId;

            if (!record) {
                ErrorHandler.throwNotFoundError("File does not exist with the provided id");
            }

            var storageKey = record.StorageKey;
            var originalFilename = record.OriginalFilename;
            var tags = record.Tags;

            await this._keywordsService.addKeywords(tenantId, tags, originalFilename);

            var fileStream = await this._storageService.downloadStream(storageKey);

            const data = await this._documentProcessor.processDocument(fileStream, '', originalFilename);
            await this._vectorstoreService.insertData(tenantId, data);

            const message = "Data added into Vectorstore";
            ResponseHandler.success(request, response, message, 200, '');

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    refreshAll = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId = request.body["TenantId"];

            ResponseHandler.success(request, response, 'Your documents are being refreshed. This may take a few moments.', 200, '');

            this.enqueueRefreshTask({
                tenantId
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    refreshById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const tenantId = request.body["TenantId"];
            const record = await this._fileResourceService.getById(request.body["id"]);
            const originalFilename = record.OriginalFilename;
            const dataDeleted = await this._vectorstoreService.deleteByFileName(originalFilename, tenantId);
            if (dataDeleted !== 'deleted') {
                ErrorHandler.throwFailedPreconditionError('Vector store was not deleted successfully');
            }

            // Keywords need to be implemented
            var storageKey = record.StorageKey;
            var fileStream = await this._storageService.downloadStream(storageKey);

            const data = await this._documentProcessor.processDocument(fileStream, '', originalFilename);

            await this._vectorstoreService.insertData(tenantId, data);
            const message = "File has been refereshed in vectorstore successfully";

            ResponseHandler.success(request, response, message, 200, '');

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: VectorStoreSearchModel = await this._validator.validateSearchRequest(request);
            const query = model.Query;
            const tenantId = model.TenantId;

            const filter = {};

            const keywords = await this._keywordsService.searchKeywords(tenantId, query);

            if (keywords.length !== 0) {
                const arrayContains = [];

                for (const keyword of keywords) {
                    arrayContains.push(keyword["metadata"]["fileName"]);
                }
                filter["source"] = {
                    "arrayContains" : arrayContains
                };
            }

            const result = await this._vectorstoreService.similaritySearch(tenantId, query, filter);
            ResponseHandler.success(request, response, result, 200);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private generateDownloadFolderPath = async() => {

        var timestamp = new Date().getTime().toString();
        var tempDownloadFolder = ConfigurationManager.DownloadTemporaryFolder;
        var downloadFolderPath = path.join(tempDownloadFolder, timestamp);

        //Make sure the path exists
        await fs.promises.mkdir(downloadFolderPath, { recursive: true });

        return downloadFolderPath;
    };

    private cleanupFiles = async (localFilePath: string) => {
        try {
            await fs.promises.unlink(localFilePath);
        } catch (error) {
            ErrorHandler.throwInternalServerError('Unable to delete downloaded file', error);
        }
    };

    //#region Queue Management

    /**
     * Enqueues a publish task to the publish queue
     */
    private enqueuePublishTask = (task: PublishTask): void => {
        this._publishQueue.push(task, (error) => {
            if (error) {
                console.error(`Error in publish queue for tenant ${task.tenantId}:`, error);
            } else {
                console.log(`Publish task completed for tenant ${task.tenantId}`);
            }
        });
    };

    /**
     * Enqueues a refresh task to the refresh queue
     */
    private enqueueRefreshTask = (task: RefreshTask): void => {
        this._refreshQueue.push(task, (error) => {
            if (error) {
                console.error(`Error in refresh queue for tenant ${task.tenantId}:`, error);
            } else {
                console.log(`Refresh task completed for tenant ${task.tenantId}`);
            }
        });
    };

    //#endregion

    private processPublishAll = async (tenantId: string, records: any[]): Promise<void> => {
        let message = "Data inserted into Vectorstore.";

        for ( const record of records ) {
            const qnaResource = await this._qnaDocumentService.getByFileResourceId(record.id);
            if (!qnaResource) {
                message += `but skipped file ${record.OriginalFilename}`;
                continue;
            }
            var storageKey = record.StorageKey;
            var originalFilename = record.OriginalFilename;
            var tags = record.Tags;
            var mimeType = mime.lookup(originalFilename);

            await this._keywordsService.addKeywords(tenantId, tags, originalFilename);

            var downloadFolderPath = await this.generateDownloadFolderPath();
            var localFilePath = path.join(downloadFolderPath, originalFilename);
            var localDestination = await this._storageService.downloadStream(storageKey);

            await this._documentProcessor.configure({
                chunkSize    : qnaResource.ChunkingLength,
                chunkOverlap : qnaResource.ChunkOverlap
            });

            const data = await this._documentProcessor.processDocument(localDestination, '', originalFilename);
            await this._vectorstoreService.insertData(tenantId, data);

            // THIS is temporary and needs to be switched to a more robust logic
            if (typeof(localDestination) === "string") {
                this.cleanupFiles(localDestination);
            }
        }
        console.log(`Publishing completed for tenant ${tenantId}: ${message}`);
    };

    /**
     * Processes refresh for all records
     */
    private processRefreshAll = async (tenantId: string, records?: any[]): Promise<void> => {
        const dataDeleted = await this._vectorstoreService.deleteCollection(tenantId);

        if (dataDeleted !== "deleted") {
            console.error(`Vector store was not deleted successfully for tenant ${tenantId}`);
            return;
        }

        if (!records) {
            records = await this._fileResourceService.getByTenantId(tenantId);
        }

        if (!records || records.length === 0) {
            console.error(`Files do not exist to create vectorstore for tenant ${tenantId}`);
            return;
        }

        let message = "Data updated in Vectorstore.";

        for ( const record of records ) {
            const qnaResource = await this._qnaDocumentService.getByFileResourceId(record.id);
            if (!qnaResource) {
                message += `but skipped file ${record.OriginalFilename}`;
                continue;
            }
            var storageKey = record.StorageKey;
            var originalFilename = record.OriginalFilename;
            var tags = record.Tags;

            await this._keywordsService.addKeywords(tenantId, tags, originalFilename);

            var localDestination = await this._storageService.downloadStream(storageKey);

            await this._documentProcessor.configure({
                chunkSize    : qnaResource.ChunkingLength,
                chunkOverlap : qnaResource.ChunkOverlap
            });

            const data = await this._documentProcessor.processDocument(localDestination, '', originalFilename);
            await this._vectorstoreService.insertData(tenantId, data);
        }
        console.log(`Refresh completed for tenant ${tenantId}: ${message}`);
    };

    //#endregion

}
