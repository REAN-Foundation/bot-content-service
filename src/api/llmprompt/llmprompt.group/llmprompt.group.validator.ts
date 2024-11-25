import express from 'express';
import joi from 'joi';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import { LlmPromptGroupCreateModel, LlmPromptGroupSearchFilters } from '../../../domain.types/llm.prompt/llm.prompt.group.domain.types';

export class LlmPromptGroupValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                Name        : joi.string(),
                Description : joi.string().optional(),
            });
            await schema.validateAsync(request.body);
            return this.getLlmPromptGroupCreateModel(request);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateGetRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                id : joi.string().required(),
              
            });
            return await schema.validateAsync(request.query);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                Name        : joi.string().optional(),
                Description : joi.string().optional(),
               
            });
            await schema.validateAsync(request.body);
            return this.getLlmPromptGroupUpdateModel(request);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };
    
    public validateSearchRequest = async (request: express.Request): Promise<LlmPromptGroupSearchFilters> => {
        try {
            const schema = joi.object({
                name : joi.string().optional(),
            });
               
            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): LlmPromptGroupSearchFilters => {

        const filters = {};
    
        const name = query.name ? query.name : null;
        if (name) {
            filters['Name'] = name;
        }
        return filters;
    };

    private getLlmPromptGroupCreateModel(request: express.Request): LlmPromptGroupCreateModel {
        const model: LlmPromptGroupCreateModel = {
            Name        : request.body.Name,
            Description : request.body.Description ? request.body.Description : null,
        };
        return model;
    }

    private getLlmPromptGroupUpdateModel(request: express.Request): LlmPromptGroupCreateModel {
        const model: LlmPromptGroupCreateModel = {
            Name        : request.body.Name ? request.body.Name : null,
            Description : request.body.Description ? request.body.Description : null,
        };
        return model;
    }

}
