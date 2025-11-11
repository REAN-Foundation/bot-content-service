import { QnaDocumentDto } from '../../../domain.types/content/qna.document.domain.types';
import { QnaDocument } from '../../models/content/qna.document.model';
import { FileResourceMapper } from '../file.resource/file.resource.mapper';
import { QnaDocumentVersionMapper } from './qna.document.version.mapper';

export class QnaDocumentMapper {

    static toResponseDto = (document: QnaDocument): QnaDocumentDto => {
        if (document === null) {
            return null;
        }
        const dto: QnaDocumentDto = {
            id                       : document.id,
            Name                     : document.Name,
            Description              : document.Description,
            ResourceId               : document.FileResource?.id,
            Keyword                  : document.Keyword,
            ChunkingStrategy         : document.ChunkingStrategy,
            ChunkingLength           : document.ChunkingLength,
            ChunkOverlap             : document.ChunkOverlap,
            Splitter                 : document.Splitter,
            DocumentType             : document.DocumentType,
            ParentDocumentResourceId : document.ParentDocumentResourceId,
            IsActive                 : document.IsActive,
            CreatedByUserId          : document.CreatedByUserId,
            FileResource             : document?.FileResource ?
                FileResourceMapper.toResponseDto(document?.FileResource) : null,
            DocumentVersion : document?.QnaDocumentVersions ? document.QnaDocumentVersions?.map(
                (x) => QnaDocumentVersionMapper.toResponseDto(x)) : null,

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
