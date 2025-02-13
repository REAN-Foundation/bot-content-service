import express from 'express';
import { VectorstoreController } from './vectorstore.controller';

////////////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {
    const router = express.Router();
    const controller = new VectorstoreController();

    router.post('/', controller.create);
    // router.post('/update', controller.update);
    router.post('/refresh', controller.refresh);
    router.post('/similarity-search', controller.search);

    app.use('/api/v1/vectorstore', router);
};
