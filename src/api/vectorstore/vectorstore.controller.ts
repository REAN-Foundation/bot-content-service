import express from 'express';
import { ResponseHandler } from '../../common/handlers/response.handler';
// import { VectorstoreValidator } from './vectorstore.validator';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { VectorstoreService } from '../../modules/vectorstores/vectorstore.service';
import { Loader } from '../../startup/loader';
import { DocumentProcessor } from '../../modules/document.processors/document.processor';

///////////////////////////////////////////////////////////////////////////////

export class VectorstoreController {

    _vectorstoreService: VectorstoreService = Loader.Container.resolve(VectorstoreService);

    private _documentProcessor = new DocumentProcessor();


    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const clientName = request.params.client;
            const projectName = request.params.project;
            const filepath = request.body.filepath;

            const data = await this._documentProcessor.processDocument(filepath);
            const result = await this._vectorstoreService.insertData(clientName, projectName, data);
            const message = "Data inserted into Vectorstore.";
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const clientName = request.params.client;
            const projectName = request.params.project;
            const filepath = request.body.filepath;

            const data = await this._documentProcessor.processDocument(filepath);
            const result = await this._vectorstoreService.insertData(clientName, projectName, data);
            const message = "Data updated in Vectorstore.";
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const clientName = request.params.client;
            const projectName = request.params.project;
            const query = request.body.query;

            const result = await this._vectorstoreService.similaritySearch(clientName, projectName, query);
            ResponseHandler.success(request, response, result, 200);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };


}