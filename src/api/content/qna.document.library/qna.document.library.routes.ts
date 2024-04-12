import express from 'express';
import { QnaDocumentLibraryController } from './qna.document.library.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {
    const router = express.Router();

    const controller = new QnaDocumentLibraryController();

    router.post('/', controller.create);
    router.get('/all', controller.getAll);
    router.get('/:id', controller.getById);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);

    app.use('/api/v1/documentlibrarys', router);
};
