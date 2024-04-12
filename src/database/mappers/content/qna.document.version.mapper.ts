import { QnaDocumentVersionResponseDto } from '../../../domain.types/content/qna.document.version.domain.types';

import { QnaDocumentVersion } from '../../models/content/qna.document.version.model';

export class QnaDocumentVersionMapper {

    static toResponseDto = (qnaDocumentVersion: QnaDocumentVersion): QnaDocumentVersionResponseDto => {
        if (qnaDocumentVersion == null) {
            return null;
        }
        const dto: QnaDocumentVersionResponseDto = {
            id             : qnaDocumentVersion.id,
            VersionNumber  : qnaDocumentVersion.VersionNumber,
            StorageUrl     : qnaDocumentVersion.StorageUrl,
            DownloadUrl    : qnaDocumentVersion.DownloadUrl,
            FileResourceId : qnaDocumentVersion.FileResourceId,
            Keywords       : qnaDocumentVersion.Keywords,
            CreatedAt      : qnaDocumentVersion.CreatedAt,
            UpdatedAt      : qnaDocumentVersion.UpdatedAt,
            QnaDocumentId  : qnaDocumentVersion.Qna_Documents
                ? {
                    id                    : qnaDocumentVersion.Qna_Documents.id,
                    Name                  : qnaDocumentVersion.Qna_Documents.Name,
                    Description           : qnaDocumentVersion.Qna_Documents.Description,
                    FileName              : qnaDocumentVersion.Qna_Documents.FileName,
                    Source                : qnaDocumentVersion.Qna_Documents.Source,
                    CreatedBy             : qnaDocumentVersion.Qna_Documents.CreatedBy,
                    ParentDocument        : qnaDocumentVersion.Qna_Documents.ParentDocument,
                    ParentDocumentVersion : qnaDocumentVersion.Qna_Documents.ParentDocumentVersion,
                    ChunkingStrategy      : qnaDocumentVersion.Qna_Documents.ChunkingStrategy,
                    ChunkingLenght        : qnaDocumentVersion.Qna_Documents.ChunkingLenght,
                    ChunkOverlap          : qnaDocumentVersion.Qna_Documents.ChunkOverlap,
                    Splitter              : qnaDocumentVersion.Qna_Documents.Splitter,
                    IsActive              : qnaDocumentVersion.Qna_Documents.IsActive,
                }
                : null,
        };
        return dto;
    };

}
