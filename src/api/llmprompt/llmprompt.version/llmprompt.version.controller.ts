
import { ErrorHandler } from "../../../common/handlers/error.handler";
import { ResponseHandler } from "../../../common/handlers/response.handler";
import express from 'express';
import { LlmPromptVersionCreateModel, LlmPromptVersionUpdateModel } from "../../../domain.types/llm.prompt/llm.prompt.version.domain.types";
import { LlmPromptVersionValidator } from "./llmprompt.version.validator";
import { LlmpromptVersionService } from "../../../database/services/llmpromptversion.service";
import { LlmpromptService } from "../../../database/services/llmprompt.service";
import { uuid } from "../../../domain.types/miscellaneous/system.types";

export class LlmPromptVersionController {

    //#region member variables and constructors

    _service: LlmpromptVersionService = new LlmpromptVersionService();

    _promptService: LlmpromptService = new LlmpromptService();

    _validator: LlmPromptVersionValidator = new LlmPromptVersionValidator();

    create = async (request: express.Request, response: express.Response) => {
        try {
            var model: LlmPromptVersionCreateModel = await this._validator.validateCreateRequest(request);

            const isPromptExist = await this._promptService.getById(model.PromptId);

            if (!isPromptExist) {
                ErrorHandler.throwNotFoundError('Prompt record not found');
            }

            const promptVersionModel = await this._service.getLatestPromptVersionByPromptId(model.PromptId);
            
            model.Version = promptVersionModel ? promptVersionModel.Version + 1 : 1;

            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add LLm prompt version!');
            }
            const message = ' LLm prompt version added successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            const id = await this._validator.validateParamAsUUID(request, 'id');
            var model: LlmPromptVersionUpdateModel = await this._validator.validateUpdateRequest(request);

            const record = await this._service.getById(id);
            if (!record) {
                ErrorHandler.throwNotFoundError("Llm prompt version not found!");
            }

            const updatedRecord = await this._service.update(id, model);
            const message = 'Llm prompt version updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    getById = async (request: express.Request, response: express.Response) => {
        try {
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (!record)
            {
                ErrorHandler.throwNotFoundError("Llm prompt version not found!");
            }
            const message = 'LLm prompt version retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getLatestPromptVersionByPromptId = async (request: express.Request, response: express.Response) => {
        try {
            const promptId: string = request.params.promptId;
            const records = await this._service.getLatestPromptVersionByPromptId(promptId);
            if (!records) {
                ErrorHandler.throwNotFoundError('Llm prompt version record not found');
            }
            const message = 'Llm prompt with latest version retrived successfully!';
            return ResponseHandler.success(request, response, message, 200, records);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    delete = async (request: express.Request, response: express.Response) => {
        try {
            const id = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (!record) {
                ErrorHandler.throwNotFoundError("Llm prompt version not found!");
            }
            const userDeleted = await this._service.delete(id);
            const result = {
                Deleted : userDeleted
            };
            const message = 'LLm prompt version deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
           
            var filters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Llm prompt records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
