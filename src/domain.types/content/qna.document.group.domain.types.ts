import { BaseSearchFilters, BaseSearchResults } from '../miscellaneous/base.search.types';
import { decimal, uuid } from '../miscellaneous/system.types';

//////////////////////////////////////////////////////////////

export interface QnaDocumentGroupCreateModel {
    Name: string;
    Description?: string;
}

export interface QnaDocumentGroupUpdateModel {
    Name?: string;
    Description?: string;
}

export interface QnaDocumentGroupDto {
    id: uuid;
    Name: string;
    Description: string;
}

export interface QnaDocumentGroupSearchFilters extends BaseSearchFilters {
    Name?: string;
}

export interface QnaDocumentGroupSearchResults extends BaseSearchResults {
    Items: QnaDocumentGroupSearchResponseDto[];
}

export interface QnaDocumentGroupSearchResponseDto {
    id?: uuid;
    Name?: string;
    Description?: string;
}
