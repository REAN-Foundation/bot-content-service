import joi from 'joi';
import express from 'express';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import {
    QnaDocumentLibraryCreateModel,
    QnaDocumentLibraryUpdateModel,
} from '../../../domain.types/content/qna.document.library.domain.types';

///////////////////////////////////////////////////////////////////////////////////////////////

export class QnaDocumentLibraryValidator extends BaseValidator {
    
    public validateCreateRequest = async (request: express.Request): Promise<QnaDocumentLibraryCreateModel> => {
        try {
            const schema = joi.object({
                DocumentId : joi.string().uuid().required(),
            });
            return await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (
        request: express.Request
    ): Promise<QnaDocumentLibraryUpdateModel | undefined> => {
        try {
            const schema = joi.object({
                DocumentId : joi.string().uuid().optional(),
            });
            return await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };
    
}
