import express from "express";
import { logger } from "../logger/logger";
import { register as registerLlmPromptRoutes } from "../api/llmprompt/llmprompt.table/llmprompt.routes";
import { register as registerLlmPromptVersionRoutes } from "../api/llmprompt/llmprompt.version/llmprompt.version.routes";
import { register as registerLlmPromptGroupRoutes } from "../api/llmprompt/llmprompt.group/llmprompt.group.routes";
// qna code
import { register as registerQnaDocumentGroup } from '../api/content/qna.document.group/qna.document.group.routes';
import { register as registerQnaDocument } from '../api/content/qna.document/qna.document.routes';
import { register as registerQnaDocumentVersion } from '../api/content/qna.document.version/qna.document.version.routes';
import { register as registerQnaDocumentLibrary } from '../api/content/qna.document.library/qna.document.library.routes';
// import { register as registerParticipantRoutes } from "../api/awards/participant/participant.routes";
// eslint-disable-next-line max-len
// import { register as registerParticipantGroupRoutes } from "../api/awards/participant.group/participant.group.routes";
// import { register as registerSchemaRoutes } from '../api/engine/schema/schema.routes';
// import { register as registerNodeRoutes } from '../api/engine/node/node.routes';
// import { register as registerRuleRoutes } from '../api/engine/rule/rule.routes';
// import { register as registerConditionRoutes } from '../api/engine/condition/condition.routes';
// import { register as registerIncomingEventRoutes } from '../api/engine/incoming.event/incoming.event.routes';
// eslint-disable-next-line max-len
// import { register as registerIncomingEventTypeRoutes } from '../api/engine/incoming.event.type/incoming.event.type.routes';
// import { register as registerSchemaInstanceRoutes } from '../api/engine/schema.instance/schema.instance.routes';
// import { register as registerTypesRoutes } from '../api/types/types.routes';
// import { register as registerFileResourceRoutes } from '../api/general/file.resource/file.resource.routes';
import { register as registerFileResourceRoutes } from '../api/file.resource/file.resource.routes';
////////////////////////////////////////////////////////////////////////////////////

export class Router {

    private _app = null;

    constructor(app: express.Application) {
        this._app = app;
    }

    public init = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {

                //Handling the base route
                this._app.get('/api/v1/', (req, res) => {
                    res.send({
                        message : `Bot-Content-Service [Version ${process.env.API_VERSION}]`,
                    });
                });

                registerLlmPromptRoutes(this._app);
                registerLlmPromptVersionRoutes(this._app);
                registerLlmPromptGroupRoutes(this._app);
                // qna code
                registerQnaDocumentGroup(this._app);
                registerQnaDocument(this._app);
                registerQnaDocumentVersion(this._app);
                registerQnaDocumentLibrary(this._app);// registerParticipantRoutes(this._app);
                registerFileResourceRoutes(this._app);
                resolve(true);

            } catch (error) {
                logger.error('Error initializing the router: ' + error.message);
                reject(false);
            }
        });
    };

}
