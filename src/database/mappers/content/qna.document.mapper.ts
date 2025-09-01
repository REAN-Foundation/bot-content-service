import { QnaDocumentDto } from '../../../domain.types/content/qna.document.domain.types';
import { QnaDocument } from '../../models/content/qna.document.model';

export class QnaDocumentMapper {

    static toResponseDto = (document: QnaDocument): QnaDocumentDto => {
        if (document === null) {
            return null;
        }
        const dto: QnaDocumentDto = {
            id                       : document.id,
            Name                     : document.Name,
            Description              : document.Description,
            ResourceId               : document.FileResource.id,
            Keyword                  : document.Keyword ? (function() {
                try {
                    const parsed = JSON.parse(document.Keyword);
                    return Array.isArray(parsed) ? parsed : [];
                } catch (error) {
                    return [];
                }
            })() : [],
            ChunkingStrategy         : document.ChunkingStrategy,
            ChunkingLength           : document.ChunkingLength,
            ChunkOverlap             : document.ChunkOverlap,
            Splitter                 : document.Splitter,
            DocumentType             : document.DocumentType,
            ParentDocumentResourceId : document.ParentDocumentResourceId,
            IsActive                 : document.IsActive,
            CreatedByUserId          : document.CreatedByUserId
        };
        return dto;
    };

    // static toArrayDto(qnaDocument: QnaDocument[]): QnaDocumentDto[] {
    //     if (qnaDocument === null) {
    //         return null;
    //     }

    //     const dto: QnaDocumentDto[] = [];

    //     qnaDocument.forEach((element) => {
    //         dto.push({
    //             id                    : element.id,
    //             Name                  : element.Name,
    //             Description           : element.Description,
    //             FileName              : element.FileName,
    //             Source                : element.Source,
    //             ParentDocument        : element.ParentDocument,
    //             ParentDocumentVersion : element.ParentDocumentVersion,
    //             ChunkingStrategy      : element.ChunkingStrategy,
    //             ChunkingLength        : element.ChunkingLength,
    //             ChunkOverlap          : element.ChunkOverlap,
    //             Splitter              : element.Splitter,
    //             IsActive              : element.IsActive,
    //             CreatedBy             : element.CreatedBy,
    //             ResourceId            : element.ResourceId
    //         });
    //     });
    //     return dto;
    // }

}
