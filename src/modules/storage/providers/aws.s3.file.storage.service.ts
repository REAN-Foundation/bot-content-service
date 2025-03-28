import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as aws from "@aws-sdk/client-s3";
import fs from 'fs';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { logger } from '../../../logger/logger';
import { Upload } from "@aws-sdk/lib-storage";

///////////////////////////////////////////////////////////////////////////////////

export class AWSS3FileStorageService  {

    //#region Publics

    exists = async (storageKey: string): Promise<string> => {
        try {
            const s3 = this.getS3Client();
            const params = {
                Bucket : process.env.STORAGE_BUCKET,
                Key    : storageKey,
            };
            const command = new aws.HeadObjectCommand(params);
            const result = await s3.send(command);
            // Logger.instance().log(JSON.stringify(result, null, 2));
            logger.info(JSON.stringify(result, null, 2));

            if (result.$metadata.httpStatusCode <= 204) {
                return null;
            }
            return storageKey;
        }
        catch (error) {
            logger.error(error);
            return null;
        }
    };

    uploadStream = async (storageKey: string, stream: Readable, contentType?: string): Promise<string> => {

        try {
            const s3Client = this.getS3Client();
            const params = {
                Bucket : process.env.STORAGE_BUCKET,
                Key    : storageKey,
                Body   : stream
            };
            if (contentType && contentType.length > 0) {
                params['ContentType'] = contentType;
            }
            const upload = new Upload({
                client : s3Client,
                params : params,
            });

            const result = await upload.done();
            logger.info(JSON.stringify(result, null, 2));

            return storageKey;
        }
        catch (error) {
            logger.error(error);
        }
    };

    upload = async (storageKey: string, localFilePath?: string): Promise<string> => {

        try {
            const fileContent = fs.readFileSync(localFilePath);
            logger.info(`Upload file to S3: ${storageKey}`);

            const s3 = this.getS3Client();
            const params = {
                Bucket : process.env.STORAGE_BUCKET,
                Key    : storageKey,
                Body   : fileContent
            };

            const command = new aws.PutObjectCommand(params);
            const response = await s3.send(command);

            logger.info(JSON.stringify(response, null, 2));

            return storageKey;
        }
        catch (error) {
            logger.error(error.message);
        }
    };

    downloadStream = async (storageKey: string): Promise<Readable> => {

        const s3 = this.getS3Client();
        const params = {
            Bucket : process.env.STORAGE_BUCKET,
            Key    : storageKey,
        };

        const command = new GetObjectCommand(params);
        const response = await s3.send(command);
        const stream = response.Body as Readable;
        return stream;
    };

    download = async (storageKey: string, localFilePath: string): Promise<string> => {

        const s3Client = this.getS3Client();
        const params = {
            Bucket : process.env.STORAGE_BUCKET,
            Key    : storageKey,
        };
        const file = fs.createWriteStream(localFilePath);
        const command = new GetObjectCommand(params);
        const response = await s3Client.send(command);
        const stream = response.Body as Readable;
        return new Promise((resolve, reject) => {
            stream.on('end', () => {
                //var st = fs.existsSync(localFilePath);
                var stats = fs.statSync(localFilePath);
                var count = 0;
                while (stats.size === 0 && count < 5) {
                    setTimeout(() => {
                        stats = fs.statSync(localFilePath);
                    }, 3000);
                    count++;
                }
                return resolve(localFilePath);
            }).on('error', (error) => {
                return reject(error);
            })
                .pipe(file);
        });
    };

    rename = async (storageKey: string, newFileName: string): Promise<boolean> => {

        const s3 = this.getS3Client();

        var s3Path = storageKey;
        var tokens = s3Path.split('/');
        var existingFileName = tokens[tokens.length - 1];
        var newPath = s3Path.replace(existingFileName, newFileName);
        if (newPath === s3Path){
            throw new Error('Old and new file identifiers are same!');
        }

        var BUCKET_NAME = process.env.STORAGE_BUCKET;
        var OLD_KEY = s3Path;
        var NEW_KEY = newPath;

        const params = {
            Bucket     : BUCKET_NAME,
            CopySource : `${BUCKET_NAME}/${OLD_KEY}`,
            Key        : NEW_KEY
        };

        // copy object
        const copyCommand = new aws.CopyObjectCommand(params);
        await s3.send(copyCommand);

        // delete old object
        const deleteCommand = new aws.DeleteObjectCommand({
            Bucket : BUCKET_NAME,
            Key    : OLD_KEY
        });
        await s3.send(deleteCommand);

        return true;
    };

    delete = async (storageKey: string): Promise<boolean> => {

        const s3 = this.getS3Client();
        const params = {
            Bucket : process.env.STORAGE_BUCKET,
            Key    : storageKey
        };

        const command = new aws.DeleteObjectCommand(params);
        const result = await s3.send(command);
        logger.info(`Delete result from S3: ${JSON.stringify(result)}`);
        if (result.$metadata.httpStatusCode !== 204) {
            return false;
        }
        return true;
    };

    getShareableLink = async (storageKey: string, durationInMinutes: number): Promise<string> => {

        const s3 = this.getS3Client();
        const getObjectParams = { Bucket: process.env.STORAGE_BUCKET, Key: storageKey };
        const command = new aws.GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: durationInMinutes * 60 });

        return url;
    };

    //#endregion

    //#region Privates

    getS3Client = (): aws.S3Client => {
        try {
            const client = new aws.S3Client({
                credentials : {
                    accessKeyId     : process.env.STORAGE_BUCKET_ACCESS_KEY_ID,
                    secretAccessKey : process.env.STORAGE_BUCKET_ACCESS_KEY_SECRET,
                },
                region : process.env.STORAGE_CLOUD_REGION
            });
            return client;
        } catch (error) {
            console.log(error);
        }
    };

    //#endregion

}
