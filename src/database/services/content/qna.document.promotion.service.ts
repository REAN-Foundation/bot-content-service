import { Repository } from 'typeorm';
import AWS from 'aws-sdk';
import { Source } from '../../database.connector';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { QnaDocument } from '../../models/content/qna.document.model';
import { QnaDocumentVersion } from '../../models/content/qna.document.version.model';
import { FileResource } from '../../models/file.resource/file.resource.model';
import { DocumentSource } from '../../../domain.types/content/qna.document.domain.types';
import {
    QnaDocumentExport,
    QnaDocumentVersionExport,
    QnaFileResourceExport,
    QnaPromotionPayload,
    QnaPromoteToRequestDto,
    QnaPromotionResult,
    QnaDocumentPromotionFromResponse,
} from '../../../domain.types/content/qna.document.promotion.domain.types';
import { QnaDocumentMapper } from '../../mappers/content/qna.document.mapper';

///////////////////////////////////////////////////////////////////////////////

export class QnaDocumentPromotionService {

    private _qnaDocumentRepository        : Repository<QnaDocument>        = Source.getRepository(QnaDocument);

    private _qnaDocumentVersionRepository : Repository<QnaDocumentVersion> = Source.getRepository(QnaDocumentVersion);

    private _fileResourceRepository       : Repository<FileResource>        = Source.getRepository(FileResource);

    private _lambda                       : AWS.Lambda;

    constructor() {
        AWS.config.update({
            region          : process.env.AWS_REGION,
            accessKeyId     : process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
        });
        this._lambda = new AWS.Lambda();
    }

    //#region promoteFrom

    public promoteFrom = async (
        qnaId             : uuid,
        tenantCode        : string,
        targetEnvironment : string
    ): Promise<QnaDocumentPromotionFromResponse> => {
        try {
            const document = await this._qnaDocumentRepository.findOne({
                where     : { id: qnaId },
                relations : {
                    FileResource        : true,
                    QnaDocumentVersions : true,
                },
            });

            if (!document) {
                ErrorHandler.throwNotFoundError(`QnaDocument with id ${qnaId} not found.`);
            }

            const fileResourceExport: QnaFileResourceExport = document.FileResource
                ? {
                    StorageKey       : document.FileResource.StorageKey,
                    MimeType         : document.FileResource.MimeType,
                    OriginalFilename : document.FileResource.OriginalFilename,
                    Size             : document.FileResource.Size,
                    Public           : document.FileResource.Public,
                    Tags             : document.FileResource.Tags,
                }
                : null;

            const versionsExport: QnaDocumentVersionExport[] = (document.QnaDocumentVersions ?? []).map((v) => ({
                Version                  : v.Version,
                Name                     : v.Name,
                Description              : v.Description,
                Keyword                  : v.Keyword,
                DocumentType             : v.DocumentType,
                ParentDocumentResourceId : v.ParentDocumentResourceId,
                ResourceId               : v.ResourceId,
                ChunkingStrategy         : v.ChunkingStrategy,
                ChunkingLength           : v.ChunkingLength,
                ChunkOverlap             : v.ChunkOverlap,
                Splitter                 : v.Splitter,
                DocumentSource           : v.DocumentSource as DocumentSource,
                IsActive                 : v.IsActive,
                CreatedByUserId          : v.CreatedByUserId,
            }));

            const documentExport: QnaDocumentExport = {
                QnaCode                  : document.QnaCode,
                Name                     : document.Name,
                Description              : document.Description,
                Keyword                  : document.Keyword,
                DocumentType             : document.DocumentType,
                ParentDocumentResourceId : document.ParentDocumentResourceId,
                ChunkingStrategy         : document.ChunkingStrategy,
                ChunkingLength           : document.ChunkingLength,
                ChunkOverlap             : document.ChunkOverlap,
                Splitter                 : document.Splitter,
                IsActive                 : document.IsActive,
                CreatedByUserId          : document.CreatedByUserId,
                FileResource             : fileResourceExport,
                Versions                 : versionsExport,
            };

            const promotionPayload: QnaPromotionPayload = {
                TenantCode        : tenantCode,
                TargetEnvironment : targetEnvironment,
                QnaDocument       : documentExport,
            };

            const functionArn = process.env.LAMBDA_PROMOTION_FUNCTION_ARN;
            if (!functionArn) {
                ErrorHandler.throwInternalServerError('Lambda promotion function ARN is not configured.');
            }

            const params: AWS.Lambda.InvocationRequest = {
                FunctionName   : functionArn,
                InvocationType : 'RequestResponse',
                LogType        : 'Tail',
                Payload        : JSON.stringify(promotionPayload),
            };

            const response        = await this._lambda.invoke(params).promise();
            const responsePayload = response.Payload ? JSON.parse(response.Payload.toString()) : null;

            if (responsePayload?.Status !== 'success') {
                logger.error(`Lambda invocation failed: ${responsePayload?.Message}`);
                ErrorHandler.throwInternalServerError(responsePayload?.Message ?? 'Lambda invocation failed');
            }

            logger.info(`Lambda invoked for QnaDocument ${qnaId} promotion to ${targetEnvironment}.`);

            return {
                QnaCode           : document.QnaCode,
                DocumentName      : document.Name,
                TenantCode        : tenantCode,
                TargetEnvironment : targetEnvironment,
                InitiatedAt       : new Date(),
                VersionCount      : versionsExport.length,
                Message           : `QnaDocument promotion to ${targetEnvironment} initiated successfully`,
            };
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    };

    //#endregion

    //#region promoteTo

    public promoteTo = async (model: QnaPromoteToRequestDto): Promise<QnaPromotionResult> => {
        try {
            const { TenantCode, QnaDocument: docData } = model;

            logger.info(`Checking if QnaDocument ${docData.QnaCode} already exists...`);

            if (!docData || !docData.QnaCode) {
                ErrorHandler.throwInputValidationError('Cannot promote QnaDocument: Missing QnaDocument data or QnaCode.');
            }
            const existing = await this._qnaDocumentRepository.findOne({
                where     : { QnaCode: docData.QnaCode },
                relations : {
                    FileResource        : true,
                    QnaDocumentVersions : true,
                },
            });

            if (existing) {
                logger.info(`QnaDocument ${docData.QnaCode} exists, syncing...`);
                const result = await this.syncDocument(existing, docData, TenantCode);
                return result;
            }

            logger.info(`QnaDocument ${docData.QnaCode} does not exist, creating...`);
            return await this.createDocument(docData, TenantCode);
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    };

    //#endregion

    //#region Private helpers

    private createDocument = async (
        docData    : QnaDocumentExport,
        tenantCode : string
    ): Promise<QnaPromotionResult> => {

        const fileResource = await this.upsertFileResource(null, docData.FileResource);

        const document = this._qnaDocumentRepository.create({
            Name                     : docData.Name,
            Description              : docData.Description,
            Keyword                  : docData.Keyword,
            DocumentType             : docData.DocumentType,
            ParentDocumentResourceId : fileResource?.id ?? docData.ParentDocumentResourceId,
            ChunkingStrategy         : docData.ChunkingStrategy,
            ChunkingLength           : docData.ChunkingLength,
            ChunkOverlap             : docData.ChunkOverlap,
            Splitter                 : docData.Splitter,
            IsActive                 : docData.IsActive,
            TenantId                 : null,
            TenantCode               : tenantCode,
            CreatedByUserId          : docData.CreatedByUserId,
            QnaCode                  : docData.QnaCode,
            FileResource             : fileResource ? { id: fileResource.id } : null,
        });

        const savedDocument = await this._qnaDocumentRepository.save(document);

        await this.upsertVersions(savedDocument.id, docData.Versions, fileResource?.id);

        const result = await this._qnaDocumentRepository.findOne({
            where     : { id: savedDocument.id },
            relations : { FileResource: true, QnaDocumentVersions: true },
        });

        logger.info(`QnaDocument ${docData.QnaCode} created successfully with id: ${savedDocument.id}`);

        return {
            action      : 'created',
            qnaDocument : QnaDocumentMapper.toResponseDto(result),
            message     : `QnaDocument ${docData.QnaCode} created successfully`,
        };
    };

    private syncDocument = async (
        existing   : QnaDocument,
        docData    : QnaDocumentExport,
        tenantCode : string
    ): Promise<QnaPromotionResult> => {

        existing.Name             = docData.Name;
        existing.Description      = docData.Description;
        existing.Keyword          = docData.Keyword;
        existing.DocumentType     = docData.DocumentType;
        existing.ChunkingStrategy = docData.ChunkingStrategy;
        existing.ChunkingLength   = docData.ChunkingLength;
        existing.ChunkOverlap     = docData.ChunkOverlap;
        existing.Splitter         = docData.Splitter;
        existing.IsActive         = docData.IsActive;
        existing.TenantCode       = tenantCode;

        const fileResource = await this.upsertFileResource(existing.FileResource?.id ?? null, docData.FileResource);
        if (fileResource) {
            existing.FileResource             = { id: fileResource.id } as FileResource;
            existing.ParentDocumentResourceId = fileResource.id;
        }

        const savedDocument = await this._qnaDocumentRepository.save(existing);

        await this.upsertVersions(savedDocument.id, docData.Versions, fileResource?.id);

        const result = await this._qnaDocumentRepository.findOne({
            where     : { id: savedDocument.id },
            relations : { FileResource: true, QnaDocumentVersions: true },
        });

        logger.info(`QnaDocument ${docData.QnaCode} synced successfully`);

        return {
            action      : 'updated',
            qnaDocument : QnaDocumentMapper.toResponseDto(result),
            message     : `QnaDocument ${docData.QnaCode} synced successfully`,
        };
    };

    private upsertFileResource = async (
        existingId : string | null,
        fileData   : QnaFileResourceExport
    ): Promise<FileResource | null> => {
        if (!fileData) {
            return null;
        }

        if (existingId) {
            const existing = await this._fileResourceRepository.findOne({ where: { id: existingId } });
            if (existing) {
                if (existing.StorageKey === fileData.StorageKey) {
                    // Same file — partial update of metadata only
                    if (fileData.MimeType         != null) existing.MimeType         = fileData.MimeType;
                    if (fileData.OriginalFilename  != null) existing.OriginalFilename = fileData.OriginalFilename;
                    if (fileData.Size             != null) existing.Size             = fileData.Size;
                    if (fileData.Public           != null) existing.Public           = fileData.Public;
                    if (fileData.Tags             != null) existing.Tags             = fileData.Tags;
                    return await this._fileResourceRepository.save(existing);
                }
                // StorageKey changed — file was replaced, fall through to create a new FileResource
            }
        }

        const newResource = this._fileResourceRepository.create({
            StorageKey       : fileData.StorageKey,
            MimeType         : fileData.MimeType,
            OriginalFilename : fileData.OriginalFilename,
            Size             : fileData.Size,
            Public           : fileData.Public,
            Tags             : fileData.Tags,
        });

        return await this._fileResourceRepository.save(newResource);
    };

    private upsertVersions = async (
        documentId     : string,
        versions       : QnaDocumentVersionExport[],
        fileResourceId : string | null
    ): Promise<void> => {
        if (!versions || versions.length === 0) {
            return;
        }

        for (const vData of versions) {
            const existing = await this._qnaDocumentVersionRepository.findOne({
                where : {
                    QnaDocument : { id: documentId },
                    Version     : vData.Version,
                },
            });

            if (existing) {
                existing.Name                     = vData.Name;
                existing.Description              = vData.Description;
                existing.Keyword                  = vData.Keyword;
                existing.DocumentType             = vData.DocumentType;
                existing.ChunkingStrategy         = vData.ChunkingStrategy;
                existing.ChunkingLength           = vData.ChunkingLength;
                existing.ChunkOverlap             = vData.ChunkOverlap;
                existing.Splitter                 = vData.Splitter;
                existing.DocumentSource           = vData.DocumentSource;
                existing.IsActive                 = vData.IsActive;
                existing.ResourceId               = fileResourceId ?? vData.ResourceId;
                existing.ParentDocumentResourceId = fileResourceId ?? vData.ParentDocumentResourceId;
                await this._qnaDocumentVersionRepository.save(existing);
            } else {
                const newVersion = this._qnaDocumentVersionRepository.create({
                    Version                  : vData.Version,
                    Name                     : vData.Name,
                    Description              : vData.Description,
                    Keyword                  : vData.Keyword,
                    DocumentType             : vData.DocumentType,
                    ParentDocumentResourceId : fileResourceId ?? vData.ParentDocumentResourceId,
                    ResourceId               : fileResourceId ?? vData.ResourceId,
                    ChunkingStrategy         : vData.ChunkingStrategy,
                    ChunkingLength           : vData.ChunkingLength,
                    ChunkOverlap             : vData.ChunkOverlap,
                    Splitter                 : vData.Splitter,
                    DocumentSource           : vData.DocumentSource,
                    IsActive                 : vData.IsActive,
                    CreatedByUserId          : vData.CreatedByUserId,
                    QnaDocument              : { id: documentId } as QnaDocument,
                });
                await this._qnaDocumentVersionRepository.save(newVersion);
            }
        }
    };

    //#endregion

}
