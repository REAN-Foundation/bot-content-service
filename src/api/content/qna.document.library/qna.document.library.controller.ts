import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { QnaDocumentLibraryValidator } from './qna.document.library.validator';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { QnaDocumentLibraryService } from '../../../database/services/content/qna.document.library.service';
import { QnaDocumentLibraryCreateModel, QnaDocumentLibrarySearchFilters } from '../../../domain.types/content/qna.document.library.domain.types';
import { QnaDocumentLibraryUpdateModel } from '../../../domain.types/content/qna.document.library.domain.types';
import { QnaDocumentVersionService } from '../../../database/services/content/qna.document.version.service';
import { DocumentSource } from '../../../domain.types/content/qna.document.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class QnaDocumentLibraryController {
    
    private _service: QnaDocumentLibraryService;

    private _documentVersionService: QnaDocumentVersionService;

    _validator: QnaDocumentLibraryValidator = new QnaDocumentLibraryValidator();

    constructor() {
        this._service = new QnaDocumentLibraryService();
        this._documentVersionService = new QnaDocumentVersionService();
    }

    create = async (request: express.Request, response: express.Response) => {
        try {
            var model: QnaDocumentLibraryCreateModel = await this._validator.validateCreateRequest(request);
            const isDocumentVersionExists = await this._documentVersionService.getById(model.DocumentVersionId);
            if (!isDocumentVersionExists) {
                ErrorHandler.throwNotFoundError('Document version can not be found!');
            }

            const isDocumentExistInLibrary = await this._service.search({
                DocumentVersionId : model.DocumentVersionId
            });

            if (isDocumentExistInLibrary.TotalCount) {
                ErrorHandler.throwConflictError('Document version already exists');
            }

            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add qna document to library!');
            }

            const documentVersionRecord = await this._documentVersionService.update(record.DocumentVersionId, {
                DocumentSource : DocumentSource.Library
            });

            if (!documentVersionRecord) {
                ErrorHandler.throwInternalServerError('Unable to update datasource in document version');
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
            if (!record) {
                ErrorHandler.throwNotFoundError('Document version can not be found in library!');
            }
           
            const message = 'Qna Document Library retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
           
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
        try {
            const record = await this._service.getById(id);
            if (!record) {
                const message = 'Qna Document Library Not found';
                ResponseHandler.failure(request, response, message, 404);
            }
            const result = await this._service.delete(id);
            const message = 'Qna Document Library deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            var filters: QnaDocumentLibrarySearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Qna Document records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
