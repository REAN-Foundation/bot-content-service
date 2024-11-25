import express from 'express';
import { LlmPromptVersionController  } from './././llmprompt.version.controller';

export const register = (app: express.Application): void => {

    const router = express.Router();
    const controller = new LlmPromptVersionController();

    router.get('/search', controller.search);
    
    router.get('/:id', controller.getById);
    router.get('/latest/:promptId', controller.getLatestPromptVersionByPromptId);
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.delete('/:id', controller.delete);
    
    app.use('/api/v1/llm-prompt-versions', router);
};
