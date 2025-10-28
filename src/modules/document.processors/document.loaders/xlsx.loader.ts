import * as XLSX from "xlsx";
import { Document } from "@langchain/core/documents";

export class XLSXLoader {

    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    async load(): Promise<Document[]> {
        const workbook = XLSX.readFile(this.filePath);
        const documents: Document[] = [];

        workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1});

            jsonData.forEach((row) => {
                documents.push(
                    new Document({
                        pageContent : JSON.stringify(row),
                        metadata    : {
                            source : this.filePath,
                            sheetName
                        },
                    })
                );
            });
        });
        return documents;
    }
}
