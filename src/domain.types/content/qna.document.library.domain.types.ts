import { uuid } from '../miscellaneous/system.types';

//////////////////////////////////////////////////////////////

export interface QnaDocumentLibraryCreateModel {
    DocumentId: uuid;
}

export interface QnaDocumentLibraryUpdateModel {
    DocumentId?: uuid;
}

export interface QnaDocumentLibraryResponseDto {
    id: uuid;
    DocumentId: uuid;
}
