import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { QnaDocumentLibraryValidator } from './qna.document.library.validator';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { QnaDocumentLibraryService } from '../../../database/services/content/qna.document.library.service';
import { QnaDocumentLibraryCreateModel } from '../../../domain.types/content/qna.document.library.domain.types';
import { QnaDocumentLibraryUpdateModel } from '../../../domain.types/content/qna.document.library.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class QnaDocumentLibraryController {
    
    public _service: QnaDocumentLibraryService;

    _validator: QnaDocumentLibraryValidator = new QnaDocumentLibraryValidator();

    constructor() {
        this._service = new QnaDocumentLibraryService();
    }

    create = async (request: express.Request, response: express.Response) => {
        try {
            var model: QnaDocumentLibraryCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add qna document library!');
            }
            const message = 'Qna Document Library added successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            const id = await this._validator.validateParamAsUUID(request, 'id');
            var model: QnaDocumentLibraryUpdateModel = await this._validator.validateUpdateRequest(request);
            const updatedRecord = await this._service.update(id, model);
            const message = 'Qna Document Library updated successfully!';
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
                const message = 'Qna Document Library retrieved successfully!';
                return ResponseHandler.success(request, response, message, 200, record);
            } else {
                const message = 'Qna Document Library Not found';
                return ResponseHandler.failure(request, response, message, 404);
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAll = async (request: express.Request, response: express.Response) => {
        try {
            const record = await this._service.getAll();
            const message = 'Qna Document Library retrieved successfully!';
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
                const message = 'Qna Document Library deleted successfully!';
                ResponseHandler.success(request, response, message, 200, result);
            } catch (error) {
                ResponseHandler.handleError(request, response, error);
            }
        } else {
            const message = 'Qna Document Library Not found';
            ResponseHandler.failure(request, response, message, 404);
        }
    };

}
