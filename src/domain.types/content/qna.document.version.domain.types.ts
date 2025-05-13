import { BaseSearchFilters, BaseSearchResults } from '../miscellaneous/base.search.types';
import { DocumentSource, QnaDocumentDto } from './qna.document.domain.types';

//////////////////////////////////////////////////////////////

export interface QnaDocumentVersionCreateModel {
    Version: number;
    Name: string;
    Description?: string;
    ResourceId :string;
    Keyword?: string;
    ChunkingStrategy: string;
    ChunkingLength: number;
    ChunkOverlap: number;
    Splitter: string;
    DocumentType: string;
    DocumentSource: DocumentSource;
    ParentDocumentResourceId: string;
    IsActive: boolean;
    CreatedByUserId: string;
    QnaDocumentId: string
}

export interface QnaDocumentVersionUpdateModel {
    Name?: string;
    Description?: string;
    // ResourceId? :string;
    Keyword?: string;
    ChunkingStrategy?: string;
    ChunkingLength?: number;
    ChunkOverlap?: number;
    Splitter?: string;
    // DocumentType?: string;
    DocumentSource?: DocumentSource;
    IsActive?: boolean;
}

export interface QnaDocumentVersionDto {
    id?: string;
    Version?: number;
    Name?: string;
    Description?: string;
    ResourceId? :string;
    Keyword?: string;
    ChunkingStrategy?: string;
    ChunkingLength?: number;
    ChunkOverlap?: number;
    Splitter?: string;
    DocumentType?: string;
    DocumentSource?: DocumentSource;
    ParentDocumentResourceId?: string;
    IsActive?: boolean;
    CreatedByUserId?: string;
    QnaDocument?: QnaDocumentDto;
}

export interface QnaDocumentVersionSearchFilters extends BaseSearchFilters {
    Version?: number;
    Name?: string;
    Description?: string;
    ResourceId? :string;
    Keyword?: string;
    ChunkingStrategy?: string;
    ChunkingLength?: number;
    ChunkOverlap?: number;
    Splitter?: string;
    DocumentType?: string;
    DocumentSource?: DocumentSource;
    ParentDocumentResourceId?: string;
    IsActive?: boolean;
    CreatedByUserId?: string;
    QnaDocumentId?: string
}

export interface QnaDocumentVersionSearchResults extends BaseSearchResults {
    Items: QnaDocumentVersionDto[];
}

export interface QnaDocumentVersionSearchResponseDto {
    id: string;
    VersionNumber: string;
    StorageUrl: string;
    DownloadUrl: string;
    FileResourceId: string;
    Keywords: string[];
    CreatedAt: Date;
    UpdatedAt: Date;
}
