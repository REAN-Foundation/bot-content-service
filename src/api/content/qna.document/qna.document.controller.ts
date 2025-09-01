import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { QnaDocumentValidator } from './qna.document.validator';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { QnaDocumentService } from '../../../database/services/content/qna.document.service';
import {
    DocumentSource,
    QnaDocumentCreateModel,
    QnaDocumentSearchFilters,
    QnaDocumentUpdateModel,
} from '../../../domain.types/content/qna.document.domain.types';
import { FileResourceService } from '../../../database/services/file.resource/file.resource.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { QnaDocumentVersionCreateModel } from '../../../domain.types/content/qna.document.version.domain.types';
import { QnaDocumentVersionService } from '../../../database/services/content/qna.document.version.service';

///////////////////////////////////////////////////////////////////////////////////////

export class QnaDocumentController {
    
    private _service: QnaDocumentService;

    private _fileResourceService: FileResourceService;

    private _documentVersionService: QnaDocumentVersionService = new QnaDocumentVersionService();

    _validator: QnaDocumentValidator = new QnaDocumentValidator();

    constructor() {
        this._service = new QnaDocumentService();
        this._fileResourceService = new FileResourceService();
    }

    create = async (request: express.Request, response: express.Response) => {
        try {
            var model: QnaDocumentCreateModel = await this._validator.validateCreateRequest(request);

            const fileResourceRecord = await this._fileResourceService.getById(model.ResourceId);

            if (!fileResourceRecord) {
                ErrorHandler.throwNotFoundError('File resource cannot be found!');
            }

            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add qna document!');
            }
            const documentVersionModel: QnaDocumentVersionCreateModel = {
                Version        : 1,
                QnaDocumentId  : record.id,
                DocumentSource : DocumentSource.Custom,
                ...record,
                Keyword        : Array.isArray(record.Keyword) ? record.Keyword.join(', ') : record.Keyword,
            };

            const documentVersionRecord = await this._documentVersionService.create(documentVersionModel);
            if (!documentVersionRecord) {
                ErrorHandler.throwInternalServerError('Unable to create Qna document version!');
            }
            const message = 'Qna document & version created successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            const id = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (!record) {
                ErrorHandler.throwNotFoundError('Qna document cannot be found!');
            }
            var model: QnaDocumentUpdateModel = await this._validator.validateUpdateRequest(request);
            const updatedRecord = await this._service.update(id, model);
            const message = 'Qna-Document updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (!record) {
                const message = 'Qna document cannot be found!';
                return ResponseHandler.failure(request, response, message, 404);
            }
            const message = 'Qna document retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
        const record = await this._service.getById(id);
        if (record != null) {
            try {
                const result = await this._service.delete(id);
                const message = 'Qna-Document deleted successfully!';
                ResponseHandler.success(request, response, message, 200, result);
            } catch (error) {
                ResponseHandler.handleError(request, response, error);
            }
        } else {
            const message = 'Qna document cannot be found';
            ResponseHandler.failure(request, response, message, 404);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            var filters: QnaDocumentSearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Qna Document records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
}
