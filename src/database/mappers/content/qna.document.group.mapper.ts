import {
    QnaDocumentGroupDto,
    QnaDocumentGroupSearchResponseDto,
} from '../../../domain.types/content/qna.document.group.domain.types';
import { QnaDocumentGroup } from '../../models/content/qna.document.groups.model';
import { QnaDocumentMapper } from './qna.document.mapper';

export class QnaDocumentGroupMapper {

    static toResponseDto = (qnaDocumentGroups: QnaDocumentGroup): QnaDocumentGroupDto => {
        if (qnaDocumentGroups == null) {
            return null;
        }
        const dto: QnaDocumentGroupDto = {
            id          : qnaDocumentGroups.id,
            Name        : qnaDocumentGroups.Name,
            Description : qnaDocumentGroups.Description,
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
