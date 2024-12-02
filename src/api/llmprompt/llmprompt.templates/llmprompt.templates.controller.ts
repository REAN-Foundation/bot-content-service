import { ErrorHandler } from "../../../common/handlers/error.handler";
import express from 'express';
import { ResponseHandler } from "../../../common/handlers/response.handler";
import { LlmPromptCreateTemplateModel, LlmPromptUpdateTemplateModel } from "../../../domain.types/llm.prompt/llm.prompt.templates.domain.types";
import { LlmPromptTemplateValidator } from "./llm.prompt.templates.validator";
import { LlmPromptTemplateService } from "../../../database/services/llmprompt.template.service";

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
}
