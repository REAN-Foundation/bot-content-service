import joi from 'joi';
import express from 'express';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { PromptUsecase } from '../../../domain.types/usecase.domain.types';
import { PromptGroup } from '../../../domain.types/promptgroup.domain.types';

///////////////////////////////////////////////////////////////////////////////////////////////

export class LlmPromptPromotionValidator {

    static validatePromoteFromRequest = async (requestBody: any) => {
        try {
            const schema = joi.object({
                TenantId          : joi.string().max(256).required(),
                TargetEnvironment : joi.string().valid('development', 'uat', 'production').required(),
            });
            return await schema.validateAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validatePromoteToRequest = async (requestBody: any) => {
        try {
            const versionSchema = joi.object({
                Version          : joi.number().required(),
                Name             : joi.string().required(),
                Description      : joi.string().allow(null, '').optional(),
                UseCaseType      : joi.string().valid(...Object.values(PromptUsecase)).required(),
                Group            : joi.string().valid(...Object.values(PromptGroup)).required(),
                Model            : joi.string().required(),
                Prompt           : joi.string().required(),
                Variables        : joi.string().allow(null, '').optional(),
                CreatedByUserId  : joi.string().required(),
                Score            : joi.number().required(),
                Temperature      : joi.number().required(),
                FrequencyPenalty : joi.number().required(),
                TopP             : joi.number().required(),
                PresencePenalty  : joi.number().required(),
                IsActive         : joi.boolean().required(),
                PublishedAt      : joi.date().allow(null).optional(),
            });

            const promptSchema = joi.object({
                PromptCode       : joi.string().max(16).required(),
                Name             : joi.string().required(),
                Description      : joi.string().allow(null, '').optional(),
                UseCaseType      : joi.string().valid(...Object.values(PromptUsecase)).required(),
                Group            : joi.string().valid(...Object.values(PromptGroup)).required(),
                Model            : joi.string().required(),
                Prompt           : joi.string().required(),
                Variables        : joi.string().allow(null, '').optional(),
                CreatedByUserId  : joi.string().required(),
                Temperature      : joi.number().required(),
                FrequencyPenalty : joi.number().required(),
                TopP             : joi.number().required(),
                PresencePenalty  : joi.number().required(),
                IsActive         : joi.boolean().required(),
                TenantId         : joi.string().allow(null, '').optional(),
                Versions         : joi.array().items(versionSchema).min(0).required(),
            });

            const schema = joi.object({
                TargetEnvironment : joi.string().valid('development', 'uat', 'production').required(),
                TenantId          : joi.string().max(256).required(),
                LlmPrompt         : promptSchema.required(),
            });

            return await schema.validateAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validateLambdaAuthHeader = (request: express.Request): boolean => {
        const lambdaAuthToken = request.headers['x-lambda-auth'] as string;
        const expectedToken   = process.env.LAMBDA_PROMOTION_AUTH_TOKEN;

        if (!expectedToken) {
            throw new Error('Lambda promotion auth token is not configured.');
        }

        if (!lambdaAuthToken || lambdaAuthToken !== expectedToken) {
            return false;
        }

        return true;
    };

}
