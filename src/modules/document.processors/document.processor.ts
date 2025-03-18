import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { Document } from "@langchain/core/documents";
import { S3Loader } from "@langchain/community/document_loaders/web/s3";
import { logger } from '../../logger/logger';
import * as fs from "fs";
import * as mime from 'mime-types';
import { Readable } from "stream";
import csvParser from "csv-parser";
import pdf from "pdf-parse";

//////////////////////////////////////////////////////////////////////////
export class DocumentProcessor {

    private readonly _textSplitter: RecursiveCharacterTextSplitter;

    constructor() {
        this._textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize    : 750,
            chunkOverlap : 50,
        });
    }

    processDocument = async (filestream: any, filePath: string, originalFilename: string): Promise< Document[] > => {
        try {
            let extension = '';
            if (filePath !== '') {
                extension = filePath.split(".").pop()?.toLowerCase();
            } else {
                extension = originalFilename.split(".").pop()?.toLocaleLowerCase();
            }
            
            let docs: Document[] = [];

            // const extension = mime.lookup(filePath);
            if (filestream !== '') {
                docs = await this.processStreamDocuments(filestream, originalFilename);
                return docs;
            } else {
                if (extension === "csv") {
                    const loader = new CSVLoader(filePath);
                    let docs = await loader.load();
                    docs = docs.map((doc) => ({
                        ...doc,
                        metadata : { ...doc.metadata, source: originalFilename }
                    }));
                    return docs;
                } else if (extension === "pdf") {
                    const loader = new PDFLoader(filePath);
                    let docs = await loader.load();
                    docs = docs.map((doc) => ({
                        ...doc,
                        metadata : { ...doc.metadata, source: originalFilename }
                    }));
                    return docs;
                } else if (extension === "txt") {
                    const text = fs.readFileSync(filePath, "utf8");
                    let docs = await this._textSplitter.createDocuments([text]);
                    docs = docs.map((doc) => ({
                        ...doc,
                        metadata : { ...doc.metadata, source: originalFilename }
                    }));
                    return docs;
                } else if (extension === "json") {
                    const loader = new JSONLoader(filePath);
                    let docs = await loader.load();
                    docs = docs.map((doc) => ({
                        ...doc,
                        metadata : { ...doc.metadata, source: originalFilename }
                    }));
                    return docs;
                } else {
                    throw new Error("Unsupported file type");
                }
            }
        } catch (error) {
            logger.error(error);
            return null;
        }
    };

    private async processStreamDocuments(stream: Readable, fileName: string): Promise<Document[]> {
        const extension = fileName.split(".").pop()?.toLowerCase();

        switch (extension) {
            case "csv":
                return this.processCSVStream(stream, fileName);
            case "json":
                return this.processJSONStream(stream, fileName);
            case "pdf":
                return this.processPDFStream(stream, fileName);
            case "txt":
                return this.processTXTStream(stream, fileName);
            default:
                throw new Error("Unsupported file type: {extension}");
        }
    }

    private async processCSVStream(stream: Readable, fileName: string): Promise<Document[]> {
        const documents: Document[] = [];

        return new Promise<Document[]>((resolve, reject) => {
            stream
                .pipe(csvParser())
                .on("data", (row) => {
                    documents.push(
                        new Document({
                            pageContent : JSON.stringify(row),
                            metadata    : { source: fileName },
                        })
                    );
                })
                .on("end", () => resolve(documents))
                .on("error", reject);
        });
    }

    private async processJSONStream(stream: Readable, fileName: string): Promise<Document[]> {
        let rawData = "";

        return new Promise<Document[]>((resolve, reject) => {
            stream
                .on("data", (chunk) => (rawData += chunk.toString()))
                .on("end", () => {
                    try {
                        const jsonData = JSON.parse(rawData);
                        const documents = jsonData.map((obj: any) => 
                            new Document({
                                pageContent : JSON.stringify(obj),
                                metadata    : { source: fileName }
                            })
                        );
                        resolve(documents);
                    } catch (error) {
                        reject(error);
                    }
                })
                .on("error", reject);
        });
    }

    private async processPDFStream(stream: Readable, fileName: string): Promise<Document[]> {
        return new Promise<Document[]>((resolve,reject) => {
            const buffer: Buffer[] = [];

            stream
                .on("data", (chunk) => buffer.push(chunk))
                .on("end", async () => {
                    try {
                        const pdfData = await pdf(Buffer.concat(buffer));
                        const text = pdfData.text;

                        const textChunks = await this._textSplitter.splitText(text);
                        const documents = textChunks.map((chunk) => 
                            new Document({
                                pageContent : chunk,
                                metadata    : { source: fileName },
                            })    
                        );
                        resolve(documents);
                    } catch (error) {
                        reject(error);
                    }
                })
                .on("error", reject);
        });
    }

    private async processTXTStream(stream: Readable, fileName: string): Promise<Document[]> {
        let rawText = "";

        return new Promise<Document[]>((resolve, reject) => {
            stream
                .on("data", (chunk) => (rawText += chunk.toString()))
                .on("end", async () => {
                    try {
                        const textChunks = await this._textSplitter.splitText(rawText);
                        const documents = textChunks.map((chunk) => 
                            new Document({
                                pageContent : chunk,
                                metadata    : { source: fileName },
                            })
                        );
                        resolve(documents);
                    } catch (error) {
                        reject(error);
                    }
                })
                .on("error", reject);
        });
    }
}