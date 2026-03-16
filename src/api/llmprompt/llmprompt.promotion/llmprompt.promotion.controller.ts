import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { LlmPromptPromotionControllerDelegate } from './llmprompt.promotion.controller.delegate';
import { ApiError } from '../../../common/handlers/error.handler';

///////////////////////////////////////////////////////////////////////////////////////

export class LlmPromptPromotionController {

    _delegate: LlmPromptPromotionControllerDelegate = null;

    constructor() {
        this._delegate = new LlmPromptPromotionControllerDelegate();
    }

    promoteFrom = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const result = await this._delegate.promoteFrom(request.body, request.params.promptId);
            const message = 'LlmPrompt promotion payload assembled successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    promoteTo = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const isValidLambdaAuth = this.validateLambdaAuthHeader(request);
            if (!isValidLambdaAuth) {
                throw new ApiError(401, 'Unauthorized: Invalid Lambda authentication token');
            }
            const result = await this._delegate.promoteTo(request.body);
            const message = `LlmPrompt ${result.action} successfully!`;
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    validateLambdaAuthHeader = (request: express.Request): boolean => {
        const lambdaAuthToken = request.headers['x-lambda-auth'] as string;
        const expectedToken   = process.env.LAMBDA_PROMOTION_AUTH_TOKEN;

        if (!expectedToken) {
            throw new Error('Lambda promotion auth token is not configured');
        }

        if (!lambdaAuthToken || lambdaAuthToken !== expectedToken) {
            return false;
        }

        return true;
    };

}
