import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { uuid } from "../miscellaneous/system.types";

export interface FileResourceCreateModel {
    TenantId          : string;
    StorageKey       ?: string;
    MimeType         ?: string;
    Metadata         ?: any;
    OriginalFilename ?: string;
    DocumentId       ?: uuid;
    Size             ?: number;
    Public           ?: boolean;
    DownloadCount    ?: number;
    Tags             ?: string[];
}

export interface FileResourceResponseDto {
    id              : uuid;
    StorageKey      : string;
    MimeType        : string;
    OriginalFilename: string;
    Size            : number;
    Public          : boolean;
    DownloadCount   : number;
    TenantId        : string;
    Tags            : string[];
    UploadedBy      : uuid;
    CreatedAt       : Date;
    UpdatedAt       : Date;
}

export interface FileResourceSearchFilters extends BaseSearchFilters {
    Filename?: string;
    DocumentId?  : uuid;
    Tags?    : string;
    TenantId?: string
}

export interface FileResourceSearchResults extends BaseSearchResults {
    Items: FileResourceResponseDto[];
}

export interface FileResourceUpdateModel {
    MimeType         ?: string;
    Metadata         ?: any;
    Public           ?: boolean;
    Tags             ?: string[];
}
