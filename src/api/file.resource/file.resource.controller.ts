import express from 'express';
import fs from 'fs';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { FileResourceService } from '../../database/services/file.resource/file.resource.service';
import { BaseController } from '../base.controller';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { ApiError, ErrorHandler } from '../../common/handlers/error.handler';
import BaseValidator from '../base.validator';
import * as mime from 'mime-types';
import { FileResourceCreateModel, FileResourceUpdateModel } from '../../domain.types/general/file.resource.domain.types';
import { FileUtils } from '../../common/utilities/file.utils';
import { StorageService } from '../../modules/storage/storage.service';
import path from 'path';
import { Helper } from '../../common/helper';
import { DownloadDisposition } from '../../domain.types/general/file.resource/file.resource.types';
import { ConfigurationManager } from '../../config/configuration.manager';
import { Loader } from '../../startup/loader';
import { FileResourceValidator } from './file.resource.validator';
import { UploadedFile } from 'express-fileupload';
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream";
import { StreamReader } from "./stream.reader";
///////////////////////////////////////////////////////////////////////////////////////

export class FileResourceController extends BaseController {

    //#region member variables and constructors
    _service: FileResourceService = null;

    _storageService: StorageService =  Loader.Container.resolve(StorageService);

    _validator: FileResourceValidator = new FileResourceValidator();

    constructor() {
        super();
        this._service = new FileResourceService();
    }

    //#endregion

    upload = async (request: express.Request, response: express.Response): Promise < void > => {
        try {

            var dateFolder = new Date().toISOString().split('T')[0];
            var originalFilename: string = request.headers['x-file-name'] as string;
            var contentLength = Array.isArray(request.headers['content-length']) ? request.headers['content-length'][0] : request.headers['content-length'];

            var mimeType = request.headers['mime-type'] ?? mime.lookup(originalFilename);
            var publicResource = request.headers['public'] === 'true' ? true : false;

            var timestamp = new Date().getTime().toString();
            var ext = FileUtils.getFileExtension(originalFilename);
            var filename = originalFilename.replace('.' + ext, "");
            filename = filename.replace(' ', "_");
            filename = filename + '_' + timestamp + '.' + ext;
            var storageKey = 'uploaded/' + dateFolder + '/' + filename;

            let contentType = "application/octet-stream";
            const tenantId = request.body.TenantId ?? request.headers['tenantid'];
            if (request.headers["content-type"]) {
                if (request.headers["content-type"] === "application/json") {
                    contentType = "application/octet-stream";
                } else {
                    contentType = request.headers["content-type"];
                }
            }
            // const contentType = request.headers["content-type"] || "application/octet-stream";

            const reader = new StreamReader(request);
            var key = await this._storageService.uploadStream(storageKey, reader.getStream(), contentType);

            if (!key) {
                ErrorHandler.throwInternalServerError(`Unable to upload the file!`);
            }
            var model: FileResourceCreateModel = {
                StorageKey       : storageKey,
                MimeType         : mimeType as string,
                Public           : publicResource,
                OriginalFilename : originalFilename,
                Tags             : request.body.Tags ? request.body.Tags : [],
                Size             : contentLength ? parseInt(contentLength) : null,
                TenantId         : tenantId
            };
            var record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to create file resource!', 400);
            }

            const message = 'File resource uploaded successfully!';
            ResponseHandler.success(request, response, message, 201, record);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    uploadBinary = async ( request: express.Request, response: express.Response ): Promise< void > => {
        try {
            //
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    download = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (!record) {
                ErrorHandler.throwNotFoundError('File resource cannot be found!');
            }
            var disposition = request.query.disposition as string;
            if (!disposition) {
                disposition = 'inline';
            }

            var storageKey = record.StorageKey;
            var originalFilename = record.OriginalFilename;
            var mimeType = mime.lookup(originalFilename);

            response.setHeader('Content-type', mimeType as string);
            this.setResponseHeaders(response, originalFilename, disposition);
            var downloadFolderPath = await this.generateDownloadFolderPath();
            var localFilePath = path.join(downloadFolderPath, originalFilename);
            var localDestination = await this._storageService.downloadStream(storageKey);
            
            if (!localDestination) {
                ErrorHandler.throwInternalServerError(`Unable to download the file!`);
            }

            this.streamToResponse(localFilePath, response, {
                MimeType    : mimeType,
                Disposition : disposition
            }, localDestination);
            // ResponseHandler.success(request, localDestination.pipe(response), '', 200, '');

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise <void> => {
        try {
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (record === null) {
                ErrorHandler.throwNotFoundError('File resource with id ' + id.toString() + ' cannot be found!');
            }
            const message = 'File resource retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateData = async (request: express.Request, response: express.Response): Promise <void> => {
        try {
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            var model: FileResourceUpdateModel = await this._validator.validateUpdateRequest(request);
            const record = await this._service.getById(id);
            if (!record) {
                ErrorHandler.throwNotFoundError("File details not found with the provided id");
            }
            const updatedRecord = await this._service.update(id, model);
            const message = "File details updated in the DB";
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (!record) {
                ErrorHandler.throwNotFoundError('File resource cannot be found!');
            }
            var success = await this._storageService.delete(record.StorageKey);

            if (!success) {
                ErrorHandler.throwInternalServerError('File resource with id ' + id.toString() + ' cannot be deleted!');
            }
            success = await this._service.delete(request.params.id);
            if (!success) {
                ErrorHandler.throwInternalServerError('File resource with id ' + id.toString() + ' cannot be deleted!');
            }
            const message = 'File resource deleted successfully!';
            ResponseHandler.success(request, response, message, 200, {
                Deleted : success
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#region Privates

    setResponseHeaders = (response: express.Response, filename: string, disposition = 'inline') => {
        if (disposition === 'inline') {
            response.setHeader('Content-disposition', 'inline');
        }
        else {
            response.setHeader('Content-disposition', 'attachment;filename=' + filename);
        }
    };

    private streamToResponse(
        localDestination: string,
        response: express.Response<any, Record<string, any>>,
        metadata, stream?) {

        if (localDestination == null) {
            throw new ApiError(404, 'File resource not found.');
        }

        var filename = path.basename(localDestination);
        var mimetype = metadata.MimeType ?? Helper.getMimeType(localDestination);
        if (!mimetype) {
            mimetype = 'text/plain';
        }

        this.setDownloadResponseHeaders(response, metadata.Disposition, mimetype, filename);

        if (stream) {
            stream.pipe(response);
        } else {
            var filestream = fs.createReadStream(localDestination);
            filestream.pipe(response);
        }
    }

    private setDownloadResponseHeaders(
        response: express.Response,
        disposition: DownloadDisposition,
        mimeType: string,
        filename: string) {

        response.setHeader('Content-type', mimeType);

        if (disposition === DownloadDisposition.Attachment) {
            response.setHeader('Content-disposition', 'attachment; filename=' + filename);
        }
        else if (disposition === DownloadDisposition.Inline ||
            (mimeType === 'image/jpeg' ||
            mimeType === 'image/png' ||
            mimeType === 'image/bmp')) {
            response.setHeader('Content-disposition', 'inline');
        }
        else {
            response.setHeader('Content-disposition', 'attachment; filename=' + filename);
        }

    }

    private generateDownloadFolderPath = async() => {

        var timestamp = new Date().getTime().toString();
        var tempDownloadFolder = ConfigurationManager.DownloadTemporaryFolder;
        var downloadFolderPath = path.join(tempDownloadFolder, timestamp);

        //Make sure the path exists
        await fs.promises.mkdir(downloadFolderPath, { recursive: true });

        return downloadFolderPath;
    };

    //#endregion

}
