import { BaseSearchFilters, BaseSearchResults } from '../miscellaneous/base.search.types';

//////////////////////////////////////////////////////////////
export enum QnaDocumentType {
    JSON = "JSON",
    CSV = "CSV",
    PDF = "PDF",
    TEXT = "Text",
    OTHER = "Other"
}

export enum DocumentSource {
    Library = "Library",
    Custom = "Custom"
}
export interface QnaDocumentCreateModel {
    Name: string;
    Description?: string;
    ResourceId :string;
    Keyword?: string[];
    ChunkingStrategy: string;
    ChunkingLength: number;
    ChunkOverlap: number;
    Splitter: string;
    DocumentType: string;
    ParentDocumentResourceId: string;
    IsActive: boolean;
    CreatedByUserId: string;
}

export interface QnaDocumentUpdateModel {
    Name?: string;
    Description?: string;
    ResourceId? :string;
    Keyword?: string[];
    ChunkingStrategy?: string;
    ChunkingLength?: number;
    ChunkOverlap?: number;
    Splitter?: string;
    DocumentType?: string;
    IsActive?: boolean;
}

export interface QnaDocumentDto {
    id?: string;
    Name: string;
    Description: string;
    ResourceId :string;
    Keyword: string[];
    ChunkingStrategy: string;
    ChunkingLength: number;
    ChunkOverlap: number;
    Splitter: string;
    DocumentType: string;
    ParentDocumentResourceId: string;
    IsActive: boolean;
    CreatedByUserId: string;
}

export interface QnaDocumentSearchFilters extends BaseSearchFilters {
    Name?: string;
    ResourceId? :string;
    Keyword?: string;
    ChunkingStrategy?: string;
    ChunkingLength?: number;
    ChunkOverlap?: number;
    Splitter?: string;
    DocumentType?: string;
    ParentDocumentResourceId?: string;
    IsActive?: boolean;
    CreatedByUserId?: string;
}
export interface QnaDocumentSearchResults extends BaseSearchResults {
    Items: QnaDocumentDto[];
}
