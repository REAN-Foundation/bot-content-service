import express from 'express';
import fs from 'fs';
import path from 'path';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { VectorstoreService } from '../../modules/vectorstores/vectorstore.service';
import { KeywordService } from '../../modules/vectorstores/keywords.service';
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

    _keywordService: KeywordService = Loader.Container.resolve(KeywordService);

    _fileResourceService: FileResourceService = new FileResourceService();

    _storageService: StorageService = Loader.Container.resolve(StorageService);

    _validator: VectorStoreValidator = new VectorStoreValidator();

    private _documentProcessor = new DocumentProcessor();


    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: VectorStoreCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._fileResourceService.getById(model.id);
            if (!record) {
                ErrorHandler.throwNotFoundError('File does not exist to create vectorstore.');
            }

            var storageKey = record.StorageKey;
            var originalFilename = record.OriginalFilename;
            var tags = record.Tags;
            var mimeType = mime.lookup(originalFilename);
            var tenantId = model.TenantId;

            await this._keywordService.addKeywords(tenantId, tags, originalFilename);

            var downloadFolderPath = await this.generateDownloadFolderPath();
            var localFilePath = path.join(downloadFolderPath, originalFilename);
            var localDestination = await this._storageService.download(storageKey, localFilePath);

            const data = await this._documentProcessor.processDocument(localDestination);
            const result = await this._vectorstoreService.insertData(tenantId, data);
            const message = "Data inserted into Vectorstore.";
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const clientName = request.params.client;
            const projectName = request.params.project;
            const filepath = request.body.filepath;

            const data = await this._documentProcessor.processDocument(filepath);
            // const result = await this._vectorstoreService.insertData(clientName, projectName, data);
            const message = "Data updated in Vectorstore.";
            // ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: VectorStoreSearchModel = await this._validator.validateSearchRequest(request);
            const query = model.Query;
            const tenantId = model.TenantId;

            const result = await this._vectorstoreService.similaritySearch(tenantId, query);
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

}