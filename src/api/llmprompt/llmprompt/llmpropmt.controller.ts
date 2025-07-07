import { LlmPromptSearchFilters, LlmPromptCreateModel, LlmPromptDto, LlmPromptUpdateModel  } from "../../../domain.types/llm.prompt/llm.prompt.domain.types";
import { LlmPromptValidator } from "./llmprompt.validator";
import { ErrorHandler } from "../../../common/handlers/error.handler";
import { ResponseHandler } from "../../../common/handlers/response.handler";
import express from 'express';
import { LlmpromptService } from "../../../database/services/llmprompt.service";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { LlmPromptVersionCreateModel } from "../../../domain.types/llm.prompt/llm.prompt.version.domain.types";
import { LlmpromptVersionService } from "../../../database/services/llmpromptversion.service";

export class LlmPromptController {

    //#region member variables and constructors

    _service: LlmpromptService = new LlmpromptService();

    _promptService: LlmpromptVersionService = new LlmpromptVersionService();

    _validator: LlmPromptValidator = new LlmPromptValidator();

    create = async (request: express.Request, response: express.Response) => {
        try {
            console.log("Inside the create request");
            console.log(request.body.Group);
            var model: LlmPromptCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to create Llm prompt!');
            }

            const promptVersionModel: LlmPromptVersionCreateModel = {
                PromptId : record.id,
                Version  : 1,
                Score    : 0,
                ...record,
            };

            const promptVersionRecord = await this._promptService.create(promptVersionModel);

            if (!promptVersionRecord) {
                ErrorHandler.throwInternalServerError('Unable to create Llm prompt version!');
            }

            const message = 'Prompt created successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            const id = await this._validator.validateParamAsUUID(request, 'id');
            var model: LlmPromptUpdateModel = await this._validator.validateUpdateRequest(request);
            const record = await this._service.getById(id);
            if (!record) {
                ErrorHandler.throwNotFoundError("Llm prompt record not found.");
            }
            const updatedRecord = await this._service.update(id, model);
            const message = 'Prompt updated successfully!';
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
                const message = 'LLm prompt record not found!';
                ErrorHandler.throwNotFoundError(message);
            }
            else {
                const message = 'Prompt retrieved successfully!';
                return ResponseHandler.success(request, response, message, 200, record);
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByStatus = async (request: express.Request, response: express.Response) => {
        try {
            const status: boolean = request.params.status === 'true';
            const records = await this._service.getByStatus(status);
            const message = 'LlmPrompt By status retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, records);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAll = async (request: express.Request, response: express.Response) => {
        try {
            const record = await this._service.getAll();
            const message = 'LLm prompt retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response) => {
        try {
            const id = await this._validator.validateParamAsUUID(request, 'id');
            const record: LlmPromptDto = await this._service.getById(id);
            if (record == null) {
                ErrorHandler.throwNotFoundError('Llm Prompt record not be found!');
            }
            const promptDeleted = await this._service.delete(id);
            const result = {
                Deleted : promptDeleted
            };
            const message = 'Prompt deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
           
            var filters: LlmPromptSearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Llm prompt records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
