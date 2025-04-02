import joi from 'joi';
import express from 'express';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import {
    QnaDocumentVersionCreateModel,
    QnaDocumentVersionSearchFilters,
    QnaDocumentVersionUpdateModel,
} from '../../../domain.types/content/qna.document.version.domain.types';
import { ChunkingStrategy } from '../../../domain.types/chunking.strategy.domain.types';
import { DocumentSource } from '../../../domain.types/content/qna.document.domain.types';

///////////////////////////////////////////////////////////////////////////////////////////////

export class QnaDocumentVersionValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request): Promise<QnaDocumentVersionCreateModel> => {
        try {
            const schema = joi.object({
                Version          : joi.string(),
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
                DocumentSource           : joi.string().valid(...Object.keys(DocumentSource)).optional(),
                ParentDocumentResourceId : joi.string().uuid().optional(),
                CreatedByUserId          : joi.string().uuid().required(),
                QnaDocumentId            : joi.string().uuid().required(),
            });
            await schema.validateAsync(request.body);
            return this.getDocumentVersionCreateModel(request);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (
        request: express.Request
    ): Promise<QnaDocumentVersionUpdateModel | undefined> => {
        try {
            const schema = joi.object({
                Name             : joi.string().required(),
                Description      : joi.string(),
                Keyword          : joi.string(),
                ChunkingStrategy : joi
                    .string()
                    .valid(...Object.values(ChunkingStrategy))
                    .optional(),
                ChunkingLength : joi.number().optional(),
                ChunkOverlap   : joi.number().optional(),
                Splitter       : joi.string().optional(),
                IsActive       : joi.boolean().optional(),
                DocumentSource : joi.string().valid(...Object.keys(DocumentSource)).optional(),
            });
            await schema.validateAsync(request.body);
            return this.getDocumentVersionUpdateModel(request);
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

    public validateSearchRequest = async (request: express.Request): Promise<QnaDocumentVersionSearchFilters> => {
        try {
            const schema = joi.object({
                version          : joi.string(),
                name             : joi.string(),
                description      : joi.string(),
                resourceId       : joi.string().uuid(),
                keyword          : joi.string(),
                chunkingStrategy : joi
                    .string()
                    .valid(...Object.values(ChunkingStrategy)),
                    
                chunkingLength           : joi.number(),
                chunkOverlap             : joi.number(),
                splitter                 : joi.string(),
                isActive                 : joi.boolean(),
                documentType             : joi.string(),
                documentSource           : joi.string().valid(...Object.keys(DocumentSource)),
                parentDocumentResourceId : joi.string().uuid(),
                createdByUserId          : joi.string().uuid(),
                storageUrl               : joi.string(),
                downloadUrl              : joi.string(),
                fileResourceId           : joi.string(),
                qnaDocumentId            : joi.string().uuid(),
            });

            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getDocumentVersionCreateModel = (request: express.Request): QnaDocumentVersionCreateModel => {
        const model : QnaDocumentVersionCreateModel = {
            Version                  : request.body.Version ? request.body.Version : null,
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
            DocumentSource           : DocumentSource.Custom,
            ParentDocumentResourceId : request.body.ParentDocumentResourceId ?
                request.body.ParentDocumentResourceId :
                request.body.ResourceId,
            CreatedByUserId : request.body.CreatedByUserId,
            QnaDocumentId   : request.body.QnaDocumentId
        };
        return model;
    };

    private getDocumentVersionUpdateModel = (request: express.Request): QnaDocumentVersionUpdateModel => {
        const model : QnaDocumentVersionUpdateModel = {
            Name             : request.body.Name ? request.body.Name : null,
            Description      : request.body.Description ? request.body.Description : null,
            Keyword          : request.body.Keyword ? request.body.Keyword : null,
            ChunkingStrategy : request.body.ChunkingStrategy ? request.body.ChunkingStrategy as ChunkingStrategy : null,
            ChunkingLength   : request.body.ChunkingLength ? request.body.ChunkingLength : null,
            ChunkOverlap     : request.body.ChunkOverlap ? request.body.ChunkOverlap : null,
            Splitter         : request.body.Splitter ? request.body.Splitter : null,
            IsActive         : request.body.IsActive ? request.body.IsActive : true,
            DocumentSource   : request.body.DocumentSource,
        };
        return model;
    };

    private getSearchFilters = (query): QnaDocumentVersionSearchFilters => {
        const filters = {};
        const versionNumber = query.versionNumber ? query.versionNumber : null;
        if (versionNumber) {
            filters['Version'] = versionNumber;
        }
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

        const isActive = query.isActive ? query.isActive : null;
        if (isActive) {
            filters['IsActive'] = isActive;
        }

        const documentType = query.documentType ? query.documentType : null;
        if (documentType) {
            filters['DocumentType'] = documentType;
        }
        const documentSource = query.documentSource ? query.documentSource : null;
        if (documentSource) {
            filters['DocumentSource'] = documentSource;
        }
        const parentDocumentResourceId = query.parentDocumentResourceId ? query.parentDocumentResourceId : null;
        if (parentDocumentResourceId) {
            filters['ParentDocumentResourceId'] = parentDocumentResourceId;
        }
        const createdByUserId = query.createdByUserId ? query.createdByUserId : null;
        if (createdByUserId) {
            filters['CreatedByUserId'] = createdByUserId;
        }
        const qnaDocumentId = query.qnaDocumentId ? query.qnaDocumentId : null;
        if (qnaDocumentId) {
            filters['QnaDocumentId'] = qnaDocumentId;
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
        return filters;
    };

}

