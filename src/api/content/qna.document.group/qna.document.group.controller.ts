import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { QnaDocumentGroupsValidator } from './qna.document.group.validator';
import { QnaDocumentGroupsService } from '../../../database/services/content/qna.document.group.service';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import {
    QnaDocumentGroupCreateModel,
    QnaDocumentGroupSearchFilters,
    QnaDocumentGroupUpdateModel,
} from '../../../domain.types/content/qna.document.group.domain.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class QnaDocumentsGroupController {

    public _service: QnaDocumentGroupsService;

    _validator: QnaDocumentGroupsValidator = new QnaDocumentGroupsValidator();

    constructor() {
        this._service = new QnaDocumentGroupsService();
    }

    create = async (request: express.Request, response: express.Response) => {
        try {
            var model: QnaDocumentGroupCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add qna documents group!');
            }
            const message = 'Qna Document Group added successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            const id = await this._validator.validateParamAsUUID(request, 'id');
            var model: QnaDocumentGroupUpdateModel = await this._validator.validateUpdateRequest(request);
            const updatedRecord = await this._service.update(id, model);
            const message = 'Qna Document Group updated successfully!';
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
                const message = 'Qna Document Group retrieved successfully!';
                return ResponseHandler.success(request, response, message, 200, record);
            } else {
                const message = 'Qna Document Group Not found';
                return ResponseHandler.failure(request, response, message, 404);
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAll = async (request: express.Request, response: express.Response) => {
        try {
            const record = await this._service.getAll();
            const message = 'Qna Document Group retrieved successfully!';
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
                const message = 'Qna Document Group deleted successfully!';
                ResponseHandler.success(request, response, message, 200, result);
            } catch (error) {
                ResponseHandler.handleError(request, response, error);
            }
        } else {
            const message = 'Qna Document Group not found!';
            ResponseHandler.failure(request, response, message, 404);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            var filters: QnaDocumentGroupSearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Qna Document Version records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
}
