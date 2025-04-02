import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { decimal, uuid } from "../miscellaneous/system.types";

export interface LlmPromptCreateTemplateModel {
    Name : string;
    Description? : string;
    Content: string;
    Variables: string;
    Version : decimal;
    TenantId? : decimal;
    Type? : string;
    Category? : string;
    SubGroup? : string;
    IsActive: boolean;
    CreatedByUserId: string;
}

export interface LlmPromptUpdateTemplateModel {
    Name?: string;
    Description?: string;
    Content?: string;
    Variables?: string;
    Version?: decimal;
    TenantId?: decimal;
    Type?: string;
    Category?: string;
    SubGroup?: string;
    IsActive?: boolean;
    CreatedByUserId?: string;
}

export interface LlmPromptTemplateDto {
    id: uuid;
    Name : string;
    Description? : string;
    Content: string;
    Variables?: string;
    Version : decimal;
    TenantId? : decimal;
    Type? : string;
    Category? : string;
    SubGroup? : string;
    IsActive: boolean;
    CreatedByUserId: string;
}

export interface QnAPromptTemplateStructure {
    Introduction?: string,
    UserQuery?: string,
    ResponseFormat?: string,
    Instruction?: string,
    Guidelines?: string,
    ChatHistory?: string,
    SimilarDocs?: string
}

export interface QnAPromptTemplateInputStructure {
    Introduction : string,
    Instruction? : string,
    Guidelines? : string
}

export interface LlmPromptTemplateSearchFilters extends BaseSearchFilters {
    id?: uuid;
    Name?: string;
    Description?: string;
    Content?: string;
    Version?: decimal;
    TenantId?: decimal;
    Type?: string;
    Category?: string;
    SubGroup?: string;
    IsActive?: boolean;
    CreatedByUserId: string;
}

export interface LlmPromptTemplateSearchResults extends BaseSearchResults {
    Items: LlmPromptTemplateDto[];
}