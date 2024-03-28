import joi from 'joi';
import express from 'express';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import {
    QnaDocumentSearchFilters,
    QnaDocumentUpdateModel,
} from '../../../domain.types/content/qna.document.domain.types';
import { ChunkingStrategy } from '../../../domain.types/chunking.strategy.domain.types';

///////////////////////////////////////////////////////////////////////////////////////////////

export class QnaDocumentValidator extends BaseValidator {
    
    public validateCreateRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                Name                  : joi.string().required(),
                Description           : joi.string(),
                FileName              : joi.string().required(),
                Source                : joi.string().required(),
                ParentDocument        : joi.string().required(),
                ParentDocumentVersion : joi.string(),
                ChunkingStrategy      : joi
                    .string()
                    .valid(...Object.values(ChunkingStrategy))
                    .required(),
                ChunkingLength : joi.number().required(),
                ChunkOverlap   : joi.number().required(),
                Splitter       : joi.string().required(),
                IsActive       : joi.boolean().required(),
                CreatedBy      : joi.string().required(),
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

    public validateUpdateRequest = async (request: express.Request): Promise<QnaDocumentUpdateModel | undefined> => {
        try {
            const schema = joi.object({
                Name                  : joi.string().optional(),
                Description           : joi.string().optional(),
                FileName              : joi.string().optional(),
                Source                : joi.string().optional(),
                ParentDocument        : joi.string().optional(),
                ParentDocumentVersion : joi.string().optional(),
                ChunkingStrategy      : joi
                    .string()
                    .valid(...Object.values(ChunkingStrategy))
                    .optional(),
                ChunkingLength : joi.number().optional(),
                ChunkOverlap   : joi.number().optional(),
                Splitter       : joi.string().optional(),
                IsActive       : joi.boolean().optional(),
                CreatedBy      : joi.string().optional(),
            });
            return await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<QnaDocumentSearchFilters> => {
        try {
            const schema = joi.object({
                Name                  : joi.string().optional(),
                Description           : joi.string().optional(),
                FileName              : joi.string().optional(),
                Source                : joi.string().optional(),
                ParentDocument        : joi.string().optional(),
                ParentDocumentVersion : joi.string().optional(),
                ChunkingStrategy      : joi
                    .string()
                    .valid(...Object.values(ChunkingStrategy))
                    .optional(),
                ChunkingLength : joi.number().optional(),
                ChunkOverlap   : joi.number().optional(),
                Splitter       : joi.number().optional(),
                IsActive       : joi.boolean().optional(),
                CreatedBy      : joi.string().optional(),
            });

            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): QnaDocumentSearchFilters => {
        var filters = {};

        var Name = query.Name ? query.Name : null;
        if (Name != null) {
            filters['Name'] = Name;
        }
        var Description = query.Description ? query.Description : null;
        if (Description != null) {
            filters['Description'] = Description;
        }
        var FileName = query.FileName ? query.FileName : null;
        if (FileName != null) {
            filters['FileName'] = FileName;
        }
        var Source = query.Source ? query.Source : null;
        if (Source != null) {
            filters['Source'] = Source;
        }
        var ParentDocument = query.ParentDocument ? query.ParentDocument : null;
        if (ParentDocument != null) {
            filters['ParentDocument'] = ParentDocument;
        }
        var ParentDocumentVersion = query.ParentDocumentVersion ? query.ParentDocumentVersion : null;
        if (ParentDocumentVersion != null) {
            filters['ParentDocumentVersion'] = ParentDocumentVersion;
        }
        var ChunkingStrategy = query.ChunkingStrategy ? query.ChunkingStrategy : null;
        if (ChunkingStrategy != null) {
            filters['ChunkingStrategy'] = ChunkingStrategy;
        }
        var ChunkingLength = query.ChunkingLength ? query.ChunkingLength : null;
        if (ChunkingLength != null) {
            filters['ChunkingLength'] = ChunkingLength;
        }
        var ChunkOverlap = query.ChunkOverlap ? query.ChunkOverlap : null;
        if (ChunkOverlap != null) {
            filters['ChunkOverlap'] = ChunkOverlap;
        }
        var Splitter = query.Splitter ? query.Splitter : null;
        if (Splitter != null) {
            filters['Splitter'] = Splitter;
        }
        var IsActive = query.IsActive ? query.IsActive : null;
        if (IsActive != null) {
            filters['IsActive'] = IsActive;
        }
        var CreatedBy = query.CreatedBy ? query.CreatedBy : null;
        if (CreatedBy != null) {
            filters['CreatedBy'] = CreatedBy;
        }
        var itemsPerPage = query.itemsPerPage ? query.itemsPerPage : 25;
        if (itemsPerPage != null) {
            filters['ItemsPerPage'] = itemsPerPage;
        }
        var orderBy = query.orderBy ? query.orderBy : 'CreatedAt';
        if (orderBy != null) {
            filters['OrderBy'] = orderBy;
        }
        var order = query.order ? query.order : 'ASC';
        if (order != null) {
            filters['Order'] = order;
        }
        return filters;
    };

}
