import express from 'express';
import { QnaDocumentsGroupController } from './qna.document.group.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {
    const router = express.Router();

    const controller = new QnaDocumentsGroupController();

    router.get('/search', controller.search);
    router.post('/', controller.create);
    router.get('/all', controller.getAll);
    router.get('/:id', controller.getById);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);

    app.use('/api/v1/documentgroups', router);
};
