import express from 'express';
import joi from 'joi';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import { LlmPromptTemplateSearchFilters } from '../../../domain.types/llm.prompt/llm.prompt.templates.domain.types';

export class LlmPromptTemplateValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                id              : joi.string(),
                Name            : joi.string().required(),
                Description     : joi.string().optional(),
                Content         : joi.string().required(),
                Variables       : joi.array().optional(),
                Version         : joi.number().required(),
                TenantId        : joi.number().optional(),
                Type            : joi.string().optional(),
                Category        : joi.string().optional(),
                SubGroup        : joi.string().optional(),
                IsActive        : joi.boolean().required(),
                CreatedByUserId : joi.string().uuid()
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
                Name            : joi.string().optional(),
                Description     : joi.string().optional(),
                Content         : joi.string().optional(),
                Variables       : joi.array().optional(),
                Version         : joi.number().optional(),
                TenantId        : joi.number().optional(),
                Type            : joi.string().optional(),
                Category        : joi.string().optional(),
                SubGroup        : joi.string().optional(),
                IsActive        : joi.boolean().optional(),
                CreatedByUserId : joi.string().guid().optional()
            });
            return await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<LlmPromptTemplateSearchFilters> => {
        try {
            const schema = joi.object({
                Name            : joi.string().optional(),
                Description     : joi.string().optional(),
                Content         : joi.string().optional(),
                Version         : joi.number().optional(),
                TenantId        : joi.number().optional(),
                Type            : joi.string().optional(),
                Category        : joi.string().optional(),
                SubGroup        : joi.string().optional(),
                IsActive        : joi.string().optional(),
                CreatedByUserId : joi.string().optional(),
                createdDateFrom : joi.date().optional(),
                createdDateTo   : joi.date().optional(),
                itemsPerPage    : joi.number().optional(),
                pageIndex       : joi.number().optional(),
                order           : joi.string().optional(),
                orderBy         : joi.string().optional(),
            });
            await schema.validateAsync(request.query);

            return await this.getFilters(request);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    getFilters = async (request): Promise<LlmPromptTemplateSearchFilters> => {
        const filters: LlmPromptTemplateSearchFilters = {
            Name            : request.query.name ?? null,
            Description     : request.query.description ?? null,
            Content         : request.query.content ?? null,
            Version         : request.query.version ?? null,
            TenantId        : request.query.tenantId ?? null,
            Type            : request.query.type ?? null,
            Category        : request.query.category ?? null,
            SubGroup        : request.query.subGroup ?? null,
            IsActive        : request.query.isActive ?? null,
            CreatedByUserId : request.query.createdByUserId ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    };

}
