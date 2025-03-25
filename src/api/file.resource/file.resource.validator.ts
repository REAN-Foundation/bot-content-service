import express from "express";
import { ErrorHandler } from "../../common/handlers/error.handler";
import BaseValidator from "../base.validator";
import joi from 'joi';
import { FileResourceUploadDomainModel } from "../../domain.types/general/file.resource/file.resource.domain.model";
import { TimeHelper } from "../../common/time.helper";
import { ConfigurationManager } from "../../config/configuration.manager";

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

}
