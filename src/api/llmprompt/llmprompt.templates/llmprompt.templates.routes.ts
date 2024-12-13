import express from 'express';
import { LlmPromptTemplatesController } from './llmprompt.templates.controller';

export const register = (app: express.Application): void => {
    const router = express.Router();
    const controller = new LlmPromptTemplatesController();

    router.get('/search', controller.search);
    router.get('/records', controller.getAll);
    router.get('/search-by-status/:status', controller.getByStatus);

    router.get('/:id', controller.getById);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);

    app.use('/api/vi/llm-prompt-templates', router);
};
