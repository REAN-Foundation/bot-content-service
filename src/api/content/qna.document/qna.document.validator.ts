import joi from 'joi';
import express from 'express';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import {
    QnaDocumentCreateModel,
    QnaDocumentSearchFilters,
    QnaDocumentUpdateModel,
} from '../../../domain.types/content/qna.document.domain.types';
import { ChunkingStrategy } from '../../../domain.types/chunking.strategy.domain.types';

///////////////////////////////////////////////////////////////////////////////////////////////

export class QnaDocumentValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                Name             : joi.string().required(),
                Description      : joi.string(),
                ResourceId       : joi.string().uuid().required(),
                Keyword          : joi.string(),
                ChunkingStrategy : joi
                    .string()
                    .valid(...Object.values(ChunkingStrategy))
                    .required(),
                ChunkingLength           : joi.number().required(),
                ChunkOverlap             : joi.number().required(),
                Splitter                 : joi.string().required(),
                IsActive                 : joi.boolean().required(),
                DocumentType             : joi.string(),
                ParentDocumentResourceId : joi.string().uuid().optional(),
                CreatedByUserId          : joi.string().uuid().required(),
             
            });
            await schema.validateAsync(request.body);
            return this.getQnaDocumentCreateModel(request);
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

    public validateUpdateRequest = async (request: express.Request): Promise<QnaDocumentUpdateModel | undefined> => {
        try {
            const schema = joi.object({
                Name             : joi.string(),
                Description      : joi.string(),
                ResourceId       : joi.string().uuid(),
                Keyword          : joi.string(),
                ChunkingStrategy : joi
                    .string()
                    .valid(...Object.values(ChunkingStrategy)),
                ChunkingLength : joi.number(),
                ChunkOverlap   : joi.number(),
                Splitter       : joi.string(),
                IsActive       : joi.boolean(),
                DocumentType   : joi.string(),
            });

            await schema.validateAsync(request.body);
            return this.getQnaDocumentUpdateModel(request);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<QnaDocumentSearchFilters> => {
        try {
            const schema = joi.object({
                name                     : joi.string().optional(),
                resourceId               : joi.string().uuid().optional(),
                keyword                  : joi.string().optional(),
                documentType             : joi.string().optional(),
                parentDocumentResourceId : joi.string().uuid().optional(),
                chunkingStrategy         : joi
                    .string()
                    .valid(...Object.values(ChunkingStrategy))
                    .optional(),
                chunkingLength  : joi.number().optional(),
                chunkOverlap    : joi.number().optional(),
                splitter        : joi.number().optional(),
                isActive        : joi.boolean().optional(),
                createdByUserId : joi.string().optional(),
            });

            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): QnaDocumentSearchFilters => {
        const filters = {};

        const name = query.name ? query.name : null;
        if (name) {
            filters['Name'] = name;
        }
        const resourceId = query.resourceId ? query.resourceId : null;
        if (resourceId) {
            filters['ResourceId'] = resourceId;
        }
        const keyword = query.keyword ? query.keyword : null;
        if (keyword) {
            filters['Keyword'] = keyword;
        }
        const documentType = query.documentType ? query.documentType : null;
        if (documentType) {
            filters['DocumentType'] = documentType;
        }
        const parentDocumentResourceId = query.parentDocumentResourceId ? query.parentDocumentResourceId : null;
        if (parentDocumentResourceId) {
            filters['ParentDocumentResourceId'] = parentDocumentResourceId;
        }
        const chunkingStrategy = query.chunkingStrategy ? query.chunkingStrategy : null;
        if (chunkingStrategy) {
            filters['ChunkingStrategy'] = chunkingStrategy;
        }
        const chunkingLength = query.chunkingLength ? query.chunkingLength : null;
        if (chunkingLength) {
            filters['ChunkingLength'] = chunkingLength;
        }
        const chunkOverlap = query.chunkOverlap ? query.chunkOverlap : null;
        if (chunkOverlap) {
            filters['ChunkOverlap'] = chunkOverlap;
        }
        
        const splitter = query.splitter ? query.splitter : null;
        if (splitter) {
            filters['Splitter'] = splitter;
        }
        var isActive = query.isActive ? query.isActive : null;
        if (isActive != null) {
            filters['isActive'] = isActive;
        }
        var createdByUserId = query.createdByUserId ? query.createdByUserId : null;
        if (createdByUserId != null) {
            filters['CreatedByUserId'] = createdByUserId;
        }
        var itemsPerPage = query.itemsPerPage ? query.itemsPerPage : 25;
        if (itemsPerPage) {
            filters['ItemsPerPage'] = itemsPerPage;
        }
        var orderBy = query.orderBy ? query.orderBy : 'CreatedAt';
        if (orderBy) {
            filters['OrderBy'] = orderBy;
        }
        var order = query.order ? query.order : 'ASC';
        if (order) {
            filters['Order'] = order;
        }
        return filters;
    };

    private getQnaDocumentCreateModel(request: express.Request): QnaDocumentCreateModel {
        const model : QnaDocumentCreateModel = {
            Name                     : request.body.Name,
            Description              : request.body.Description ? request.body.Description : null,
            ResourceId               : request.body.ResourceId,
            Keyword                  : request.body.Keyword ? request.body.Keyword : null,
            ChunkingStrategy         : request.body.ChunkingStrategy as ChunkingStrategy,
            ChunkingLength           : request.body.ChunkingLength,
            ChunkOverlap             : request.body.ChunkOverlap,
            Splitter                 : request.body.Splitter,
            IsActive                 : request.body.IsActive ? request.body.IsActive : true,
            DocumentType             : request.body.DocumentType,
            ParentDocumentResourceId : request.body.ParentDocumentResourceId ?
                request.body.ParentDocumentResourceId :
                request.body.ResourceId,
            CreatedByUserId : request.body.CreatedByUserId
        };
        return model;
    }

    private getQnaDocumentUpdateModel(request: express.Request): QnaDocumentUpdateModel {
        const model: QnaDocumentUpdateModel = {
            Name             : request.body.Name ? request.body.Name : null,
            Description      : request.body.Description ? request.body.Description : null,
            ResourceId       : request.body.ResourceId ? request.body.ResourceId : null,
            Keyword          : request.body.Keyword ? request.body.Keyword : null,
            ChunkingStrategy : request.body.ChunkingStrategy ? request.body.ChunkingStrategy : null,
            ChunkingLength   : request.body.ChunkingLength ? request.body.ChunkingLength : null,
            ChunkOverlap     : request.body.ChunkOverlap ? request.body.ChunkOverlap : null,
            Splitter         : request.body.Splitter ? request.body.Splitter : null,
            IsActive         : request.body.IsActive,
            DocumentType     : request.body.DocumentType ? request.body.DocumentType : null
        };
        return model;
    }

}
