import express from 'express';
import { QnaDocumentController } from './qna.document.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {
    const router = express.Router();
    const controller = new QnaDocumentController();

    router.get('/search', controller.search);
    router.post('/', controller.create);
    router.get('/:id', controller.getById);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);

    app.use('/api/v1/documents', router);
};
