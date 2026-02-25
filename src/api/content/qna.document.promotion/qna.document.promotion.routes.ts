import express from 'express';
import { QnaDocumentPromotionController } from './qna.document.promotion.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router     = express.Router();
    const controller = new QnaDocumentPromotionController();

    router.post('/:qnaId/promotion-from', controller.promoteFrom);

    router.post('/promotion-to', controller.promoteTo);

    app.use('/api/v1/qna-promotion', router);
};
