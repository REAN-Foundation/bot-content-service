import express from 'express';
import { VectorstoreController } from './vectorstore.controller';

////////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {
    const router = express.Router();
    const controller = new VectorstoreController();

    router.post('/:client/:project/create', controller.create);
    router.post('/:client/:project/update', controller.update);
    router.post('/:client/:project/search', controller.search);

    app.use('/api/v1/vectorstore', router);
};
