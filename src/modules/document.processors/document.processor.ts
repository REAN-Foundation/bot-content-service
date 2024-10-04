import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import * as fs from "fs";

//////////////////////////////////////////////////////////////////////////
export class DocumentProcessor {

    private readonly _textSplitter: RecursiveCharacterTextSplitter;

    constructor() {
        this._textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize    : 750,
            chunkOverlap : 50,
        });
    }

    processDocument = async (filePath: string): Promise< Document[] > => {
        const extension = filePath.split(".").pop()?.toLowerCase();

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
        } else {
            throw new Error("Unsupported file type");
        }
    };
}