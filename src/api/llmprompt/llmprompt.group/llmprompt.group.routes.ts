import express from 'express';
import { LlmPromptGroupController } from './llmprompt.group.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new LlmPromptGroupController();

    router.get('/search', controller.search);
    router.get('/:id', controller.getById);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);
    
    app.use('/api/v1/llm-prompt-groups', router);
};
