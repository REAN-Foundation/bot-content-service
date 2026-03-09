import express from 'express';
import { LlmPromptPromotionController } from './llmprompt.promotion.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router     = express.Router();
    const controller = new LlmPromptPromotionController();

    router.post('/:promptId/promotion-from', controller.promoteFrom);

    router.post('/promotion-to', controller.promoteTo);

    app.use('/api/v1/llm-prompt-promotion', router);
};
