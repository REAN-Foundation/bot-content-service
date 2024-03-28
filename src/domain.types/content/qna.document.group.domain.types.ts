import { BaseSearchFilters, BaseSearchResults } from '../miscellaneous/base.search.types';
import { decimal, uuid } from '../miscellaneous/system.types';

//////////////////////////////////////////////////////////////

export interface QnaDocumentGroupCreateModel {
    QnaDocumentId: uuid;
    Name: string;
    Description?: string;
}

export interface QnaDocumentGroupUpdateModel {
    Name?: string;
    Description?: string;
    QnaDocumentId?: uuid;
}

export interface QnaDocumentGroupResponseDto {
    id: uuid;
    Name: string;
    Description: string;
    QnaDocument: {
        id: string;
        Name: string;
        Description: string;
        FileName: string;
        Source: string;
        ParentDocument: string;
        ParentDocumentVersion: string;
        ChunkingStrategy: string;
        ChunkingLength: decimal;
        ChunkOverlap: decimal;
        Splitter: string;
        IsActive: boolean;
        CreatedBy: string;
    };
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
