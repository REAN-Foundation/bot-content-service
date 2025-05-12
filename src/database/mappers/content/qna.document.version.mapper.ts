import { DocumentSource } from '../../../domain.types/content/qna.document.domain.types';
import { QnaDocumentVersionDto } from '../../../domain.types/content/qna.document.version.domain.types';

import { QnaDocumentVersion } from '../../models/content/qna.document.version.model';
import { QnaDocumentMapper } from './qna.document.mapper';

export class QnaDocumentVersionMapper {

    static toResponseDto = (qnaDocumentVersion: QnaDocumentVersion): QnaDocumentVersionDto => {
        if (qnaDocumentVersion == null) {
            return null;
        }

        const dto: QnaDocumentVersionDto = {
            id                       : qnaDocumentVersion.id,
            Version                  : qnaDocumentVersion.Version,
            Name                     : qnaDocumentVersion.Name,
            Description              : qnaDocumentVersion.Description,
            Keyword                  : qnaDocumentVersion.Keyword,
            ChunkingStrategy         : qnaDocumentVersion.ChunkingStrategy,
            ChunkingLength           : qnaDocumentVersion.ChunkingLength,
            ChunkOverlap             : qnaDocumentVersion.ChunkOverlap,
            Splitter                 : qnaDocumentVersion.Splitter,
            IsActive                 : qnaDocumentVersion.IsActive,
            DocumentType             : qnaDocumentVersion.DocumentType,
            DocumentSource           : qnaDocumentVersion.DocumentSource as DocumentSource,
            ParentDocumentResourceId : qnaDocumentVersion.ParentDocumentResourceId,
            CreatedByUserId          : qnaDocumentVersion.CreatedByUserId,
            ResourceId               : qnaDocumentVersion.ResourceId,
            QnaDocument              : qnaDocumentVersion.QnaDocument ?
                QnaDocumentMapper.toResponseDto(qnaDocumentVersion.QnaDocument) : null,
        };
        return dto;
    };

}
