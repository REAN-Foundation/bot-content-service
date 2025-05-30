import express from 'express';
import { QnaDocumentVersionController } from './qna.document.version.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {
    const router = express.Router();
    const controller = new QnaDocumentVersionController();

    router.get('/search', controller.search);
    router.get('/latest/:documentId', controller.getLatestDocumentVersionByDocumentId);
    router.post('/', controller.create);
    router.get('/:id', controller.getById);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);

    app.use('/api/v1/document-versions', router);
};
