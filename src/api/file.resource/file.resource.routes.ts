import express from 'express';
import { FileResourceController } from './file.resource.controller';

///////////////////////////////////////////////////////////////////////////////////

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new FileResourceController();

    router.post('/upload', controller.upload);
    router.post('/upload-binary', controller.uploadBinary);
    router.get('/download/:id', controller.download);
    router.get('/:id', controller.getById);
    router.put('/:id', controller.updateData);
    router.delete('/:id', controller.delete);

    app.use('/api/v1/file-resources', router);
};
