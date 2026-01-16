import express from "express";
import { ErrorHandler } from "../../common/handlers/error.handler";
import BaseValidator from "../base.validator";
import joi from 'joi';
import { FileResourceUploadDomainModel } from "../../domain.types/general/file.resource/file.resource.domain.model";
import { TimeHelper } from "../../common/time.helper";
import { ConfigurationManager } from "../../config/configuration.manager";
import { FileResourceConstants } from "../../domain.types/general/file.resource/file.resource.constants";

export class FileResourceValidator extends BaseValidator {

    constructor(){
        super();
    }

    public upload = async (request: express.Request) => {
        if (!request.files || !request.files.file) {
            ErrorHandler.throwInputValidationError('No file uploaded!!');
        }
    };

    public validateUpdateRequest = async (request: express.Request) => {
        try {
            const schema = joi.object({
                MimeType : joi.string().optional(),
                Metadata : joi.any().optional(),
                Public   : joi.bool().optional(),
                Tags     : joi.array().optional()
            });
            return await schema.validateAsync(request.body);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateFileUpdateRequest = async (request: express.Request) => {
        // Validate if file is provided in headers
        if (!request.headers['x-file-name']) {
            ErrorHandler.throwInputValidationError('File name header is required for file update!');
        }

        const schema = joi.object({
            MimeType : joi.string().optional(),
            Metadata : joi.any().optional(),
            Public   : joi.bool().optional(),
            Tags     : joi.array().optional()
        });
        return await schema.validateAsync(request.body);
    };

    public validateFileType = (filename: string, mimeType?: string): boolean => {
        const extension = filename.split('.').pop()?.toLowerCase();

        if (!extension || !FileResourceConstants.SUPPORTED_FILE_EXTENSIONS.includes(extension)) {
            ErrorHandler.throwInputValidationError(
                `Unsupported file type .${extension}. Supported file types are: ${FileResourceConstants.SUPPORTED_FILE_EXTENSIONS.join(', ')}`
            );
        }

        if (mimeType && !FileResourceConstants.SUPPORTED_MIME_TYPES.includes(mimeType.toLowerCase())) {
            ErrorHandler.throwInputValidationError(
                `Unsupported MIME type: ${mimeType}. Please ensure the file is one of: ${FileResourceConstants.SUPPORTED_MIME_TYPES.join(', ')}`
            );
        }

        return true;
    };

}
