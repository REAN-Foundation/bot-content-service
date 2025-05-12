import joi from 'joi';
import express from 'express';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import {
    QnaDocumentLibraryCreateModel,
    QnaDocumentLibrarySearchFilters,
    QnaDocumentLibraryUpdateModel,
} from '../../../domain.types/content/qna.document.library.domain.types';

///////////////////////////////////////////////////////////////////////////////////////////////

export class QnaDocumentLibraryValidator extends BaseValidator {
    
    public validateCreateRequest = async (request: express.Request): Promise<QnaDocumentLibraryCreateModel> => {
        try {
            const schema = joi.object({
                DocumentVersionId : joi.string().uuid().required(),
            });
            await schema.validateAsync(request.body);
            return this.getDocumentLibraryCreateModel(request);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (
        request: express.Request
    ): Promise<QnaDocumentLibraryUpdateModel | undefined> => {
        try {
            const schema = joi.object({
                DocumentVersionId : joi.string().uuid().optional(),
            });
            await schema.validateAsync(request.body);
            return this.getDocumentLibraryUpdateModel(request);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };
    
    public validateSearchRequest = async (request: express.Request): Promise<QnaDocumentLibrarySearchFilters> => {
        try {
            const schema = joi.object({
                documentVersionId : joi.string().optional(),
                createdDateFrom   : joi.date().optional(),
                createdDateTo     : joi.date().optional(),
                itemsPerPage      : joi.number().optional(),
                pageIndex         : joi.number().optional(),
                order             : joi.string().optional(),
                orderBy           : joi.string().optional(),
            });

            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (request): QnaDocumentLibrarySearchFilters => {
        const filters: QnaDocumentLibrarySearchFilters = {
            DocumentVersionId : request.query.documentVersionId ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    };

    private getDocumentLibraryCreateModel(request): QnaDocumentLibraryCreateModel {
        const model: QnaDocumentLibraryCreateModel = {
            DocumentVersionId : request.body.DocumentVersionId
        };

        return model;
    }

    private getDocumentLibraryUpdateModel(request): QnaDocumentLibraryCreateModel {
        const model: QnaDocumentLibraryCreateModel = {
            DocumentVersionId : request.body.DocumentVersionId
        };

        return model;
    }

}
