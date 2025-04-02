import { ErrorHandler } from "../../../common/handlers/error.handler";
import express from 'express';
import { ResponseHandler } from "../../../common/handlers/response.handler";
import { LlmPromptCreateTemplateModel, LlmPromptUpdateTemplateModel, LlmPromptTemplateSearchFilters, LlmPromptTemplateDto } from "../../../domain.types/llm.prompt/llm.prompt.templates.domain.types";
import { LlmPromptTemplateValidator } from "./llm.prompt.templates.validator";
import { LlmPromptTemplateService } from "../../../database/services/llmprompt.template.service";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
export class LlmPromptTemplatesController {

    // implement any required service initailization
    _service: LlmPromptTemplateService = new LlmPromptTemplateService();

    _validator: LlmPromptTemplateValidator = new LlmPromptTemplateValidator();

    create = async(request: express.Request, response: express.Response) => {
        try {
            var model: LlmPromptCreateTemplateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to create llm template prompt!');
            }
            const message = "Prompt Template created successfully.";
            ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            const id = await this._validator.validateParamAsUUID(request, 'id');
            var model: LlmPromptUpdateTemplateModel = await this._validator.validateUpdateRequest(request);
            const record = await this._service.getById(id);
            if (!record) {
                ErrorHandler.throwNotFoundError("Llm prompt template record not found.");
            }
            const updatedRecord = await this._service.update(id, model);
            const message = "Llm Prompt Template updated successfully";
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (record === null) {
                const message = "Llm template record not found.";
                ErrorHandler.throwNotFoundError(message);
            } else {
                const message = "Llm template retrieved successfully.";
                return ResponseHandler.success(request, response, message, 200, record);
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAll = async (request: express.Request, response: express.Response) => {
        try {
            const record = await this._service.getAll();
            const message = 'Llm templates retireved successfully.';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            var filters: LlmPromptTemplateSearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Llm prompt template records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByStatus = async (request: express.Request, response: express.Response) => {
        try {
            const status: boolean = request.params.status === 'true';
            const records = await this._service.getByStatus(status);
            const message = 'Llm prompt templates by status retrieved successfully';
            return ResponseHandler.success(request, response, message, 200, records);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response) => {
        try {
            const id = await this._validator.validateParamAsUUID(request, 'id');
            const record: LlmPromptTemplateDto = await this._service.getById(id);
            if (record == null) {
                ErrorHandler.throwNotFoundError('Llm prompt template record not found!');
            }
            const promptTemplateDeleted = await this._service.delete(id);
            const result = {
                Deleted : promptTemplateDeleted
            };
            const message = 'Prompt template deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
}
