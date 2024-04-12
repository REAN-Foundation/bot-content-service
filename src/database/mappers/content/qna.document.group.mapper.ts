import {
    QnaDocumentGroupResponseDto,
    QnaDocumentGroupSearchResponseDto,
} from '../../../domain.types/content/qna.document.group.domain.types';
import { QnaDocumentGroup } from '../../models/content/qna.document.groups.model';
import { QnaDocumentMapper } from './qna.document.mapper';

export class QnaDocumentGroupsMapper {

    static toResponseDto = (qnaDocumentGroups: QnaDocumentGroup): QnaDocumentGroupResponseDto => {
        if (qnaDocumentGroups == null) {
            return null;
        }
        const dto: QnaDocumentGroupResponseDto = {
            id          : qnaDocumentGroups.id,
            Name        : qnaDocumentGroups.Name,
            Description : qnaDocumentGroups.Description,
            QnaDocument : QnaDocumentMapper.toResponseDto(
                qnaDocumentGroups.QnaDocuments?.length > 0 ? qnaDocumentGroups.QnaDocuments[0] : null
            ),
        };
        return dto;
    };

    static toSearchResponseDto = (qnaDocumentGroups): QnaDocumentGroupSearchResponseDto => {
        if (qnaDocumentGroups == null) {
            return null;
        }
        const dto: QnaDocumentGroupSearchResponseDto = {
            id          : qnaDocumentGroups.id,
            Name        : qnaDocumentGroups.Name,
            Description : qnaDocumentGroups.Description,
        };
        return dto;
    };
    
}
