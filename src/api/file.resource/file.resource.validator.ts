import express from "express";
import { ErrorHandler } from "../../common/handlers/error.handler";
import BaseValidator from "../base.validator";
import { FileResourceUploadDomainModel } from "../../domain.types/general/file.resource/file.resource.domain.model";
import { TimeHelper } from "../../common/time.helper";
import { ConfigurationManager } from "../../config/configuration.manager";

export class FileResourceValidator extends BaseValidator {

    constructor(){
        super();
    }

    upload = async (request: express.Request) => {
        if (!request.files || !request.files.file) {
            ErrorHandler.throwInputValidationError('No file uploaded!!');
        }
    };

}
