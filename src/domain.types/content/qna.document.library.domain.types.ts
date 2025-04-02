import { BaseSearchFilters, BaseSearchResults } from '../miscellaneous/base.search.types';
import { uuid } from '../miscellaneous/system.types';

//////////////////////////////////////////////////////////////

export interface QnaDocumentLibraryCreateModel {
    DocumentVersionId: uuid;
}

export interface QnaDocumentLibraryUpdateModel {
    DocumentVersionId?: uuid;
}

export interface QnaDocumentLibraryDto {
    id?: uuid;
    DocumentVersionId?: uuid;
}

export interface QnaDocumentLibrarySearchFilters extends BaseSearchFilters {
    DocumentVersionId?: uuid;
}

export interface QnaDocumentLibrarySearchResults extends BaseSearchResults {
    Items: QnaDocumentLibraryDto[];
}
