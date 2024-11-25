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
                documentVersionId : joi.string().optional()
            });

            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): QnaDocumentLibrarySearchFilters => {
        const filters = {};

        const documentVersionId = query.documentVersionId ? query.documentVersionId : null;
        if (documentVersionId) {
            filters['DocumentVersionId'] = documentVersionId;
        }
        return filters;
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
