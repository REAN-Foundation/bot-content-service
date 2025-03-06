import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { Document } from "@langchain/core/documents";
import { S3Loader } from "@langchain/community/document_loaders/web/s3";
import { logger } from '../../logger/logger';
import * as fs from "fs";
import * as mime from 'mime-types';

//////////////////////////////////////////////////////////////////////////
export class DocumentProcessor {

    private readonly _textSplitter: RecursiveCharacterTextSplitter;

    constructor() {
        this._textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize    : 750,
            chunkOverlap : 50,
        });
    }

    processDocument = async (filestream: any, filePath: string): Promise< Document[] > => {
        try {
            // const extension = filePath.split(".").pop()?.toLowerCase();

            const extension = mime.lookup(filePath);

            if (extension === "csv") {
                const loader = new CSVLoader(filePath);
                const docs = await loader.load();
                return docs;
            } else if (extension === "pdf") {
                const loader = new PDFLoader(filePath);
                const docs = await loader.load();
                return docs;
            } else if (extension === "txt") {
                const text = fs.readFileSync(filePath, "utf8");
                const docs = await this._textSplitter.createDocuments([text]);
                return docs;
            } else if (extension === "json") {
                const loader = new JSONLoader(filePath);
                const docs = await loader.load();
                return docs;
            } else {
                throw new Error("Unsupported file type");
            }
        } catch (error) {
            logger.error(error);
            return null;
        }
    };
}