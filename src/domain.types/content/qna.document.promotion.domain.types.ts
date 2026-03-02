import { DocumentSource } from './qna.document.domain.types';

//////////////////////////////////////////////////////////////

export interface QnaFileResourceExport {
    StorageKey       : string;
    MimeType         : string;
    OriginalFilename : string;
    Size             : number;
    Public           : boolean;
    Tags             : string[];
}

export interface QnaDocumentVersionExport {
    Version                  : number;
    Name                     : string;
    Description              : string;
    Keyword                  : string;
    DocumentType             : string;
    ParentDocumentResourceId : string;
    ResourceId               : string;
    ChunkingStrategy         : string;
    ChunkingLength           : number;
    ChunkOverlap             : number;
    Splitter                 : string;
    DocumentSource           : DocumentSource;
    IsActive                 : boolean;
    CreatedByUserId          : string;
}

export interface QnaDocumentExport {
    QnaCode                  : string;
    Name                     : string;
    Description              : string;
    Keyword                  : string;
    DocumentType             : string;
    ParentDocumentResourceId : string;
    ChunkingStrategy         : string;
    ChunkingLength           : number;
    ChunkOverlap             : number;
    Splitter                 : string;
    IsActive                 : boolean;
    CreatedByUserId          : string;
    FileResource             : QnaFileResourceExport;
    Versions                 : QnaDocumentVersionExport[];
}

export interface QnaPromoteFromRequestDto {
    TenantCode         : string;
    TargetEnvironment  : string;
}

export interface QnaPromotionPayload {
    TenantCode        : string;
    TargetEnvironment : string;
    QnaDocument       : QnaDocumentExport;
}

export interface QnaPromoteToRequestDto {
    TenantCode  : string;
    QnaDocument : QnaDocumentExport;
}

export interface QnaPromotionResult {
    action      : string;
    qnaDocument : any;
    message     : string;
}

export interface QnaDocumentPromotionFromResponse {
    QnaCode           : string;
    DocumentName      : string;
    TenantCode        : string;
    TargetEnvironment : string;
    InitiatedAt       : Date;
    VersionCount      : number;
    Message           : string;
}