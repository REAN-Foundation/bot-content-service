import express from "express";
import { logger } from "../logger/logger";
import { register as registerLlmPromptRoutes } from "../api/llmprompt/llmprompt/llmprompt.routes";
import { register as registerLlmPromptVersionRoutes } from "../api/llmprompt/llmprompt.version/llmprompt.version.routes";
import { register as registerLlmPromptGroupRoutes } from "../api/llmprompt/llmprompt.group/llmprompt.group.routes";

import { register as registerQnaDocumentGroup } from '../api/content/qna.document.group/qna.document.group.routes';
import { register as registerQnaDocument } from '../api/content/qna.document/qna.document.routes';
import { register as registerQnaDocumentVersion } from '../api/content/qna.document.version/qna.document.version.routes';
import { register as registerQnaDocumentLibrary } from '../api/content/qna.document.library/qna.document.library.routes';
import { register as registerFileResourceRoutes } from '../api/file.resource/file.resource.routes';

import { register as registerVectorStoreRoutes } from '../api/vectorstore/vectorstore.routes';
////////////////////////////////////////////////////////////////////////////////////

export class Router {

    private _app = null;

    constructor(app: express.Application) {
        this._app = app;
    }

    public init = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {
                
                this._app.get('/api/v1/', (req, res) => {
                    res.send({
                        message : `Bot-Content-Service [Version ${process.env.API_VERSION}]`,
                    });
                });

                registerLlmPromptRoutes(this._app);
                registerLlmPromptVersionRoutes(this._app);
                registerLlmPromptGroupRoutes(this._app);
                registerQnaDocumentGroup(this._app);
                registerQnaDocument(this._app);
                registerQnaDocumentVersion(this._app);
                registerQnaDocumentLibrary(this._app);
                registerFileResourceRoutes(this._app);
                registerVectorStoreRoutes(this._app);
                resolve(true);

            } catch (error) {
                logger.error('Error initializing the router: ' + error.message);
                reject(false);
            }
        });
    };

}
