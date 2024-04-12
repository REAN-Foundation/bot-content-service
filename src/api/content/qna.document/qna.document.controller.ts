import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { QnaDocumentValidator } from './qna.document.validator';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { QnaDocumentService } from '../../../database/services/content/qna.document.service';
import {
    QnaDocumentCreateModel,
    QnaDocumentSearchFilters,
    QnaDocumentUpdateModel,
} from '../../../domain.types/content/qna.document.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class QnaDocumentController {
    
    public _service: QnaDocumentService;

    _validator: QnaDocumentValidator = new QnaDocumentValidator();

    constructor() {
        this._service = new QnaDocumentService();
    }

    create = async (request: express.Request, response: express.Response) => {
        try {
            var model: QnaDocumentCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add qna document!');
            }
            const message = 'Qna-Document added successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            const id = await this._validator.validateParamAsUUID(request, 'id');
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
            if (record != null) {
                const message = 'Qna-Document retrieved successfully!';
                return ResponseHandler.success(request, response, message, 200, record);
            } else {
                const message = 'Qna-Document not found';
                return ResponseHandler.failure(request, response, message, 404);
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAll = async (request: express.Request, response: express.Response) => {
        try {
            const record = await this._service.getAll();
            const message = 'Qna-Document retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByStatus = async (request: express.Request, response: express.Response) => {
        try {
            const status: boolean = request.params.status === 'true';
            const records = await this._service.getByStatus(status);
            const message = 'Qna document By status retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, records);
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
            const message = 'Qna-Document not found';
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
