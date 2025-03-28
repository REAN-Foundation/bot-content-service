import express from 'express';
import joi from 'joi';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import { LlmPromptVersionSearchFilters } from '../../../domain.types/llm.prompt/llm.prompt.version.domain.types';
import { PromptUsecase } from '../../../domain.types/usecase.domain.types';

export class LlmPromptVersionValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                Version          : joi.number().optional(),
                Score            : joi.number().optional(),
                PromptId         : joi.string().required(),
                Name             : joi.string().required(),
                Description      : joi.string().optional(),
                UseCaseType      : joi.string().valid(...Object.values(PromptUsecase)).optional(),
                Group            : joi.string().required(),
                Model            : joi.string(),
                Prompt           : joi.string().required(),
                Variables        : joi.string().optional(),
                CreatedByUserId  : joi.string().uuid().required(),
                Temperature      : joi.number().required(),
                FrequencyPenalty : joi.number(),
                TopP             : joi.number(),
                PresencePenalty  : joi.number(),
                IsActive         : joi.boolean(),
            });
            return await schema.validateAsync(request.body);
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
                Name             : joi.string().optional(),
                Description      : joi.string().optional(),
                UseCaseType      : joi.string().valid(...Object.values(PromptUsecase)).optional(),
                Group            : joi.string().optional(),
                Model            : joi.string().optional(),
                Prompt           : joi.string().optional(),
                Variables        : joi.string().optional(),
                Temperature      : joi.number().optional(),
                FrequencyPenalty : joi.number().optional(),
                TopP             : joi.number().optional(),
                PresencePenalty  : joi.number().optional(),
                IsActive         : joi.boolean().optional(),
                Score            : joi.number().optional(),
                PublishedAt      : joi.date().optional(),
            });
            return await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<LlmPromptVersionSearchFilters> => {
        try {
            const schema = joi.object({
                version          : joi.string().optional(),
                promptId         : joi.string().guid().optional(),
                score            : joi.string().optional(),
                publishedAt      : joi.date().optional(),
                name             : joi.string().optional(),
                description      : joi.string().optional(),
                useCaseType      : joi.string().valid(...Object.values(PromptUsecase)).optional(),
                group            : joi.string().optional(),
                model            : joi.string().optional(),
                variables        : joi.string().optional(),
                createdByUserId  : joi.string().uuid().optional(),
                temperature      : joi.number().optional(),
                frequencyPenalty : joi.number().optional(),
                topP             : joi.number().optional(),
                presencePenalty  : joi.number().optional(),
                isActive         : joi.boolean().optional(),
            });
            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): LlmPromptVersionSearchFilters => {

        const filters = {};

        const versionNumber = query.version ? query.version : null;
        if (versionNumber) {
            filters['Version'] = versionNumber;
        }
        const name = query.name ? query.name : null;
        if (name) {
            filters['Name'] = name;
        }
        const useCaseType = query.useCaseType ? query.useCaseType : null;
        if (useCaseType) {
            filters['UseCaseType'] = useCaseType;
        }
        const groupName = query.group ? query.group : null;
        if (groupName) {
            filters['Group'] = groupName;
        }
        const modelName = query.model ? query.model : null;
        if (modelName) {
            filters['Model'] = modelName;
        }
        const prompt = query.prompt ? query.prompt : null;
        if (prompt) {
            filters['Prompt'] = prompt;
        }
        const promptId = query.promptId ? query.promptId : null;
        if (promptId) {
            filters['PromptId'] = promptId;
        }
        const variables = query.variables ? query.variables : null;
        if (variables) {
            filters['Variables'] = variables;
        }
        const userId = query.createdByUserId ? query.createdByUserId : null;
        if (userId) {
            filters['CreatedByUserId'] = userId;
        }
        const temperature = query.temperature ? query.temperature : null;
        if (temperature) {
            filters['Temperature'] = temperature;
        }
        const frequencyPenalty = query.frequencyPenalty ? query.frequencyPenalty : null;
        if (frequencyPenalty) {
            filters['FrequencyPenalty'] = frequencyPenalty;
        }
        const topP = query.topP ? query.topP : null;
        if (topP) {
            filters['TopP'] = topP;
        }
        const presencePenalty = query.presencePenalty ? query.presencePenalty : null;
        if (presencePenalty) {
            filters['PresencePenalty'] = presencePenalty;
        }
        const isActive = query.isActive ? query.isActive : null;
        if (isActive) {
            filters['IsActive'] = isActive;
        }
        const itemsPerPage = query.itemsPerPage ? query.itemsPerPage : 25;
        if (itemsPerPage != null) {
            filters['ItemsPerPage'] = itemsPerPage;
        }
        const orderBy = query.orderBy ? query.orderBy : 'CreatedAt';
        if (orderBy != null) {
            filters['OrderBy'] = orderBy;
        }
        const order = query.order ? query.order : 'ASC';
        if (order != null) {
            filters['Order'] = order;
        }
        
        const score = query.score ? query.score : null;
        if (score) {
            filters['Score'] = score;
        }
        const publishedAt = query.publishedAt ? query.publishedAt : null;
        if (publishedAt != null) {
            filters['PublishedAt'] = publishedAt;
        }
        
        return filters;
    };

}

