/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Config } from './database.config';
import { logger } from '../logger/logger';
import { DataSource } from "typeorm";
import path from "path";
import fs from 'fs';
import { QnaDocumentGroup } from "./models/content/qna.document.groups.model";
import { QnaDocument } from "./models/content/qna.document.model";
import { QnaDocumentVersion } from "./models/content/qna.document.version.model";
import { DBLogger } from "./database.logger";
import { LlmPromptVersion } from "./models/llm.prompt/llm.prompt.versions.model";
import { LlmPromptGroup } from "./models/llm.prompt/llm.prompt.groups.model";
import { LlmPrompt } from "./models/llm.prompt/llm.prompts.model";
import { QnaDocumentLibrary } from "./models/content/qna.document.library.model";
import { FileResource } from "./models/file.resource/file.resource.model";

///////////////////////////////////////////////////////////////////////////////////

logger.info(`environment : ${process.env.NODE_ENV}`);
logger.info(`db name     : ${Config.database}`);
logger.info(`db username : ${Config.username}`);
logger.info(`db host     : ${Config.host}`);

///////////////////////////////////////////////////////////////////////////////////

class DatabaseConnector {

    // static _basePath = path.join(process.cwd(), 'src/database/models').replace(/\\/g, '/');

    // static _folders = this.getFoldersRecursively(this._basePath)
    //     .map(y => y.replace(/\\/g, '/'))
    //     .map(x => '"' + x + '/*.js"');

    //static _entities = this;

    static _source = new DataSource({
        name        : Config.dialect,
        type        : Config.dialect,
        host        : Config.host,
        port        : Config.port,
        username    : Config.username,
        password    : Config.password,
        database    : Config.database,
        synchronize : true,
        //entities    : [this._basePath + '/**/**{.model.ts}'],
        entities    : [
            QnaDocumentGroup,
            QnaDocumentVersion,
            QnaDocument,
            LlmPromptGroup,
            LlmPrompt,
            LlmPromptVersion,
            QnaDocumentLibrary,
            FileResource,
        ],
        migrations  : [],
        subscribers : [],
        //logger      : 'advanced-console', //Use console for the typeorm logging
        logger      : new DBLogger(),
        logging     : true,
        poolSize    : Config.pool.max,
        cache       : true,
    });

    static getFoldersRecursively(location: string) {
        const items = fs.readdirSync(location, { withFileTypes: true });
        let paths = [];
        for (const item of items) {
            if (item.isDirectory()) {
                const fullPath = path.join(location, item.name);
                const childrenPaths = this.getFoldersRecursively(fullPath);
                paths = [
                    ...paths,
                    fullPath,
                    ...childrenPaths,
                ];
            }
        }
        return paths;
    }

    static initialize = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            this._source
                .initialize()
                .then(() => {
                    logger.info('Database connection has been established successfully.');
                    resolve(true);
                })
                .catch(error => {
                    logger.error('Unable to connect to the database:' + error.message);
                    reject(false);
                });
        });

    };

}

///////////////////////////////////////////////////////////////////////////////////

const Source = DatabaseConnector._source;

export { DatabaseConnector as DBConnector, Source };
