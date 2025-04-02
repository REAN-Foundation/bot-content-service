import { QnaDocumentLibraryDto } from '../../../domain.types/content/qna.document.library.domain.types';
import { QnaDocumentLibrary } from '../../models/content/qna.document.library.model';

export class QnaDocumentLibraryMapper {

    static toResponseDto = (qnaDocumentLibrary: QnaDocumentLibrary): QnaDocumentLibraryDto => {
        if (qnaDocumentLibrary == null) {
            return null;
        }
        const dto: QnaDocumentLibraryDto = {
            id                : qnaDocumentLibrary.id,
            DocumentVersionId : qnaDocumentLibrary.DocumentVersionId,
        };
        return dto;
    };

    // static toArrayDto(qnaDocumentLibrary: QnaDocumentLibrary[]): QnaDocumentLibraryResponseDto[] {
    //     if (qnaDocumentLibrary === null) {
    //         return null;
    //     }

    //     const dto: QnaDocumentLibraryResponseDto[] = [];

    //     qnaDocumentLibrary.forEach((element) => {
    //         dto.push({
    //             id         : element.id,
    //             DocumentId : element.DocumentId,
    //         });
    //     });
    //     return dto;
    // }

}
