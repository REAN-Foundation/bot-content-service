import { PassThrough } from "stream";
import { Request } from "express";

/**
 * StreamReader class that converts an Express request into a readable stream
 */
export class StreamReader {
    private passThrough: PassThrough;

    constructor(req: Request) {
        this.passThrough = new PassThrough();
        this.init(req);
    }

    private init(req: Request) {
        req.on("data", (chunk) => {
            this.passThrough.write(chunk);
        });

        req.on("end", () => {
            this.passThrough.end();
        });

        req.on("error", (err) => {
            console.error("StreamReader error:", err);
            this.passThrough.destroy(err);
        });
    }

    getStream() {
        return this.passThrough;
    }
}