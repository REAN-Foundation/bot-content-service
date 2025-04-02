
import { ErrorHandler } from "../../../common/handlers/error.handler";
import { ResponseHandler } from "../../../common/handlers/response.handler";
import express from 'express';
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { QnaDocumentGroupService } from "../../../database/services/content/qna.document.group.service";
import { QnaDocumentGroupValidator } from "./qna.document.group.validator";
import { QnaDocumentService } from "../../../database/services/content/qna.document.service";
import { QnaDocumentGroupCreateModel, QnaDocumentGroupDto, QnaDocumentGroupSearchFilters, QnaDocumentGroupUpdateModel } from "../../../domain.types/content/qna.document.group.domain.types";

export class QnaDocumentGroupController {

    //#region member variables and constructors

    _service: QnaDocumentGroupService = new QnaDocumentGroupService();

    _validator: QnaDocumentGroupValidator = new QnaDocumentGroupValidator();

    _qnaDocumentRepository: QnaDocumentService = new QnaDocumentService();

    create = async (request: express.Request, response: express.Response) => {
        try {
            var model: QnaDocumentGroupCreateModel = await this._validator.validateCreateRequest(request);
            const searchResults = await this._service.search({
                Name : model.Name
            });
            if (searchResults.TotalCount) {
                ErrorHandler.throwDuplicateUserError("Qna document group is already exists");
            }
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Error in creating qna document group!');
            }
            const message = ' Qna document group created successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            const id = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (!record) {
                ErrorHandler.throwNotFoundError('Qna document group cannot be found!');
            }
            var model: QnaDocumentGroupUpdateModel = await this._validator.validateUpdateRequest(request);
            const updatedRecord = await this._service.update(id, model);
            const message = 'Qna document updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    getById = async (request: express.Request, response: express.Response) => {
        try {
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (record === null)
            {
                const message = 'Qna Document Group cannot be found!';
                ErrorHandler.throwNotFoundError(message);
            }
            else {
                const message = 'Qna document retrieved successfully!';
                return ResponseHandler.success(request, response, message, 200, record);
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response) => {
        try {
            const id = await this._validator.validateParamAsUUID(request, 'id');
            const record: QnaDocumentGroupDto = await this._service.getById(id);
            if (!record) {
                ErrorHandler.throwNotFoundError('Document Group not found!');
            }
            const userDeleted = await this._service.delete(id);
            const result = {
                Deleted : userDeleted
            };
            const message = 'Document Group deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
           
            var filters: QnaDocumentGroupSearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Qna document group records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
