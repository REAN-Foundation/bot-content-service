import { BaseSearchFilters, BaseSearchResults } from '../miscellaneous/base.search.types';
import { decimal, uuid } from '../miscellaneous/system.types';

import { QnaDocumentGroupResponseDto } from './qna.document.group.domain.types';

//////////////////////////////////////////////////////////////

export interface QnaDocumentCreateModel {
    Name: string;
    Description?: string;
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
}

export interface QnaDocumentUpdateModel {
    Name?: string;
    Description?: string;
    FileName?: string;
    Source?: string;
    ParentDocument?: string;
    ParentDocumentVersion?: string;
    ChunkingStrategy?: string;
    ChunkingLength?: decimal;
    ChunkOverlap?: decimal;
    Splitter?: string;
    IsActive?: boolean;
    CreatedBy?: string;
}

export interface QnaDocumentResponseDto {
    id: uuid;
    Name: string;
    Description: string;
    FileName: string;
    QnaDocumentGroup?: QnaDocumentGroupResponseDto;
    Source: string;
    ParentDocument: string;
    ParentDocumentVersion: string;
    ChunkingStrategy: string;
    ChunkingLength: decimal;
    ChunkOverlap: decimal;
    Splitter: string;
    IsActive: boolean;
    CreatedBy: string;
}

export interface QnaDocumentSearchFilters extends BaseSearchFilters {
    id?: uuid;
    Name?: string;
    Description?: string;
    FileName?: string;
    Source?: string;
    ParentDocument?: string;
    ParentDocumentVersion?: string;
    ChunkingStrategy?: string;
    ChunkingLength?: decimal;
    ChunkOverlap?: decimal;
    Splitter?: string;
    IsActive?: boolean;
    CreatedBy?: string;
}
export interface QnaDocumentSearchResults extends BaseSearchResults {
    id?: uuid;
    Name?: string;
}
