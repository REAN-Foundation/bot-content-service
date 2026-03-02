import joi from 'joi';
import express from 'express';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { ChunkingStrategy } from '../../../domain.types/chunking.strategy.domain.types';
import { DocumentSource } from '../../../domain.types/content/qna.document.domain.types';

///////////////////////////////////////////////////////////////////////////////////////////////

export class QnaDocumentPromotionValidator {

    static validatePromoteFromRequest = async (requestBody: any) => {
        try {
            const schema = joi.object({
                TenantCode        : joi.string().max(256).required(),
                TargetEnvironment : joi.string().valid('dev', 'uat', 'prod').required(),
            });
            return await schema.validateAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validatePromoteToRequest = async (requestBody: any) => {
        try {
            const versionSchema = joi.object({
                Version                  : joi.number().required(),
                Name                     : joi.string().required(),
                Description              : joi.string().allow(null, '').optional(),
                Keyword                  : joi.string().allow(null, '').optional(),
                DocumentType             : joi.string().required(),
                ParentDocumentResourceId : joi.string().required(),
                ResourceId               : joi.string().required(),
                ChunkingStrategy         : joi.string().valid(...Object.values(ChunkingStrategy)).required(),
                ChunkingLength           : joi.number().required(),
                ChunkOverlap             : joi.number().required(),
                Splitter                 : joi.string().required(),
                DocumentSource           : joi.string().valid(...Object.values(DocumentSource)).required(),
                IsActive                 : joi.boolean().required(),
                CreatedByUserId          : joi.string().required(),
            });

            const fileResourceSchema = joi.object({
                StorageKey       : joi.string().required(),
                MimeType         : joi.string().required(),
                OriginalFilename : joi.string().required(),
                Size             : joi.number().required(),
                Public           : joi.boolean().required(),
                Tags             : joi.array().items(joi.string()).allow(null).optional(),
            });

            const documentSchema = joi.object({
                QnaCode                  : joi.string().max(16).required(),
                Name                     : joi.string().required(),
                Description              : joi.string().allow(null, '').optional(),
                Keyword                  : joi.string().allow(null, '').optional(),
                DocumentType             : joi.string().required(),
                ParentDocumentResourceId : joi.string().required(),
                ChunkingStrategy         : joi.string().valid(...Object.values(ChunkingStrategy)).required(),
                ChunkingLength           : joi.number().required(),
                ChunkOverlap             : joi.number().required(),
                Splitter                 : joi.string().required(),
                IsActive                 : joi.boolean().required(),
                CreatedByUserId          : joi.string().required(),
                FileResource             : fileResourceSchema.required(),
                Versions                 : joi.array().items(versionSchema).min(1).required(),
            });

            const schema = joi.object({
                TargetEnvironment : joi.string().valid('dev', 'uat', 'prod').required(),
                TenantCode        : joi.string().max(256).required(),
                QnaDocument       : documentSchema.required(),
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