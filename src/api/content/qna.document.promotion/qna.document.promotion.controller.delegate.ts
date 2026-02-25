import { QnaDocumentPromotionService } from '../../../database/services/content/qna.document.promotion.service';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { logger } from '../../../logger/logger';
import { QnaDocumentPromotionValidator as validator } from './qna.document.promotion.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class QnaDocumentPromotionControllerDelegate {

    _promotionService: QnaDocumentPromotionService = null;

    constructor() {
        this._promotionService = new QnaDocumentPromotionService();
    }

    promoteFrom = async (requestBody: any, qnaId: string) => {
        await validator.validatePromoteFromRequest(requestBody);

        const { TenantCode, TargetEnvironment } = requestBody;

        if (!qnaId) {
            ErrorHandler.throwInputValidationError('QnaDocument id is required.');
        }

        logger.info(`Exporting QnaDocument ${qnaId} for promotion to ${TargetEnvironment}...`);

        const payload = await this._promotionService.promoteFrom(qnaId, TenantCode, TargetEnvironment);

        logger.info(`QnaDocument ${qnaId} exported successfully.`);

        return payload;
    };

    promoteTo = async (requestBody: any) => {
        await validator.validatePromoteToRequest(requestBody);

        const { TargetEnvironment, TenantCode, QnaDocument } = requestBody;

        const currentEnv = process.env.NODE_ENV;
        if (TargetEnvironment !== currentEnv) {
            ErrorHandler.throwInputValidationError(
                `Target environment mismatch. Expected: ${currentEnv}, Received: ${TargetEnvironment}`
            );
        }

        logger.info(`Receiving QnaDocument ${QnaDocument.QnaCode} for tenant ${TenantCode}...`);

        const result = await this._promotionService.promoteTo({ TenantCode, QnaDocument });

        logger.info(`QnaDocument ${QnaDocument.QnaCode} promotion completed.`);

        return result;
    };

}