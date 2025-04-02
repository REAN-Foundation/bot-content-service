import express from 'express';
import fs from 'fs';
import path from 'path';
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

///////////////////////////////////////////////////////////////////////////////

export class VectorstoreController {

    _vectorstoreService: VectorstoreService = Loader.Container.resolve(VectorstoreService);

    _keywordsService: KeywordsService = Loader.Container.resolve(KeywordsService);

    _fileResourceService: FileResourceService = new FileResourceService();

    _storageService: StorageService = Loader.Container.resolve(StorageService);

    _validator: VectorStoreValidator = new VectorStoreValidator();

    private _documentProcessor = new DocumentProcessor();


    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: VectorStoreCreateModel = await this._validator.validateCreateRequest(request);
            // const record = await this._fileResourceService.getById(model.id);
            const tenantId = model.TenantId;
            const records = await this._fileResourceService.getByTenantId(tenantId);
            if (!records || records.length === 0) {
                ErrorHandler.throwNotFoundError('Files do not exist to create vectorstore.');
            }

            for ( const record of records ) {
                var storageKey = record.StorageKey;
                var originalFilename = record.OriginalFilename;
                var tags = record.Tags;
                var mimeType = mime.lookup(originalFilename);

                await this._keywordsService.addKeywords(tenantId, tags, originalFilename);

                var downloadFolderPath = await this.generateDownloadFolderPath();
                var localFilePath = path.join(downloadFolderPath, originalFilename);
                var localDestination = await this._storageService.downloadStream(storageKey);

                const data = await this._documentProcessor.processDocument(localDestination, '', originalFilename);
                await this._vectorstoreService.insertData(tenantId, data);

                // THIS is temporary and needs to be switched to a more robust logic
                if (typeof(localDestination) === "string") {
                    this.cleanupFiles(localDestination);
                }
            }
            const message = "Data inserted into Vectorstore.";
            ResponseHandler.success(request, response, message, 200, '');
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    createById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: VectorStoreCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._fileResourceService.getById(model.id);
            const tenantId = model.TenantId;
            const records = await this._fileResourceService.getById(model.id);

            if (!records) {
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

            // const data = await this._documentProcessor.processDocument(filepath);
            const dataDeleted = await this._vectorstoreService.deleteCollection(tenantId);

            if (dataDeleted !== "deleted") {
                ErrorHandler.throwFailedPreconditionError("Vector store was not deleted successfully");
            }

            const records = await this._fileResourceService.getByTenantId(tenantId);
            if (!records || records.length === 0) {
                ErrorHandler.throwNotFoundError('Files do not exist to create vectorstore.');
            }

            for ( const record of records ) {
                var storageKey = record.StorageKey;
                var originalFilename = record.OriginalFilename;
                var tags = record.Tags;

                await this._keywordsService.addKeywords(tenantId, tags, originalFilename);

                var localDestination = await this._storageService.downloadStream(storageKey);

                const data = await this._documentProcessor.processDocument(localDestination, '', originalFilename);
                await this._vectorstoreService.insertData(tenantId, data);
            }
            const message = "Data updated in Vectorstore.";
            ResponseHandler.success(request, response, message, 200, '');
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

}