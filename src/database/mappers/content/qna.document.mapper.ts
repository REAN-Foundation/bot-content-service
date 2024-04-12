import { QnaDocumentResponseDto } from '../../../domain.types/content/qna.document.domain.types';
import { QnaDocument } from '../../models/content/qna.document.model';

export class QnaDocumentMapper {

    static toResponseDto = (qnaDocument: QnaDocument): QnaDocumentResponseDto => {
        if (qnaDocument === null) {
            return null;
        }
        const dto: QnaDocumentResponseDto = {
            id                    : qnaDocument.id,
            Name                  : qnaDocument.Name,
            Description           : qnaDocument.Description,
            FileName              : qnaDocument.FileName,
            Source                : qnaDocument.Source,
            ParentDocument        : qnaDocument.ParentDocument,
            ParentDocumentVersion : qnaDocument.ParentDocumentVersion,
            ChunkingStrategy      : qnaDocument.ChunkingStrategy,
            ChunkingLenght        : qnaDocument.ChunkingLenght,
            ChunkOverlap          : qnaDocument.ChunkOverlap,
            Splitter              : qnaDocument.Splitter,
            IsActive              : qnaDocument.IsActive,
            CreatedBy             : qnaDocument.CreatedBy,
           
        };
        return dto;
    };

    static toArrayDto(qnaDocument: QnaDocument[]): QnaDocumentResponseDto[] {
        if (qnaDocument === null) {
            return null;
        }

        const dto: QnaDocumentResponseDto[] = [];

        qnaDocument.forEach((element) => {
            dto.push({
                id                    : element.id,
                Name                  : element.Name,
                Description           : element.Description,
                FileName              : element.FileName,
                Source                : element.Source,
                ParentDocument        : element.ParentDocument,
                ParentDocumentVersion : element.ParentDocumentVersion,
                ChunkingStrategy      : element.ChunkingStrategy,
                ChunkingLenght        : element.ChunkingLenght,
                ChunkOverlap          : element.ChunkOverlap,
                Splitter              : element.Splitter,
                IsActive              : element.IsActive,
                CreatedBy             : element.CreatedBy,
                // ResourceId? :string;
            });
        });
        return dto;
    }

}
