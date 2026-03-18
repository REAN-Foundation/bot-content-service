import { LlmPromptPromotionService } from '../../../database/services/llmprompt.promotion.service';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { logger } from '../../../logger/logger';
import { LlmPromptPromotionValidator as validator } from './llmprompt.promotion.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class LlmPromptPromotionControllerDelegate {

    _promotionService: LlmPromptPromotionService = null;

    constructor() {
        this._promotionService = new LlmPromptPromotionService();
    }

    promoteFrom = async (requestBody: any, promptId: string) => {
        await validator.validatePromoteFromRequest(requestBody);

        const { TenantId, TargetEnvironment } = requestBody;

        if (!promptId) {
            ErrorHandler.throwInputValidationError('LlmPrompt id is required.');
        }

        logger.info(`Exporting LlmPrompt ${promptId} for promotion to ${TargetEnvironment}...`);

        const payload = await this._promotionService.promoteFrom(promptId, TenantId, TargetEnvironment);

        logger.info(`LlmPrompt ${promptId} exported successfully.`);

        return payload;
    };

    promoteTo = async (requestBody: any) => {
        await validator.validatePromoteToRequest(requestBody);

        const { TargetEnvironment, TenantId, LlmPrompt } = requestBody;

        const currentEnv = process.env.NODE_ENV;
        const normalize = (env: string) => (env === 'prod' ? 'production' : env);
        if (normalize(TargetEnvironment) !== normalize(currentEnv)) {
            ErrorHandler.throwInputValidationError(
                `Target environment mismatch. Expected: ${currentEnv}, Received: ${TargetEnvironment}`
            );
        }

        logger.info(`Receiving LlmPrompt ${LlmPrompt.PromptCode} for tenant ${TenantId}...`);

        const result = await this._promotionService.promoteTo({ TenantId, LlmPrompt });

        logger.info(`LlmPrompt ${LlmPrompt.PromptCode} promotion completed.`);

        return result;
    };

}
