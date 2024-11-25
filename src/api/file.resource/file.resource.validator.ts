import express from "express";
import { ErrorHandler } from "../../common/handlers/error.handler";
import BaseValidator from "../base.validator";

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
