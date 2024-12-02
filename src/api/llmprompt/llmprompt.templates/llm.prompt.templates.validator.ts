import express from 'express';
import joi from 'joi';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';

export class LlmPromptTemplateValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                id              : joi.string(),
                Name            : joi.string().required(),
                Description     : joi.string().optional(),
                Content         : joi.string().required(),
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

    public validateUpdateRequest = async (request: express.Request) => {
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
                IsActive        : joi.boolean().optional(),
                CreatedByUserId : joi.string().guid().optional()
            });
            return await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };
}