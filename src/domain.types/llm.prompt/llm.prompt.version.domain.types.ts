import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { decimal, uuid } from "../miscellaneous/system.types";

export interface  LlmPromptVersionDto {
    id?              : uuid;
    PromptId?: string;
    Version?   : number;
    Name?              : string;
    Description?      : string;
    UseCaseType?       : string;
    Group?             : string;
    Model?         : string;
    Prompt?: string;
    Variables?: string;
    CreatedByUserId?            : string;
    Temperature?       : decimal;
    FrequencyPenalty? : decimal;
    TopP?              : decimal;
    PresencePenalty?   : decimal;
    IsActive?          : boolean;
    PublishedAt?     : Date;
}
export interface  LlmPromptVersionCreateModel {
    PromptId: string;
    Version?   : number;
    Score: number;
    Name              : string;
    Description?      : string;
    UseCaseType       : string;
    Group             : string;
    Model         : string;
    Prompt: string;
    Variables: string[];
    CreatedByUserId            : string;
    Temperature       : number;
    FrequencyPenalty : number;
    TopP              : number;
    PresencePenalty   : decimal;
    IsActive          : boolean;
}

export interface  LlmPromptVersionUpdateModel {
    Score?: number;
    Name?              : string;
    Description?      : string;
    UseCaseType?       : string;
    Group?             : string;
    Model?         : string;
    Prompt?: string;
    Variables?: string;
    Temperature?       : number;
    FrequencyPenalty? : number;
    TopP?              : number;
    PresencePenalty?   : decimal;
    IsActive?          : boolean;
    PublishedAt?: Date
}

export interface LlmPromptVersionSearchFilters extends BaseSearchFilters {
    Version?            : string;
    PromptId?           : uuid;
    Score?              : number;
    PublishedAt?        : Date;
    id?                 : uuid;
    Name?               : string;
    UseCaseType?        : string;
    Group?              : string;
    Model?              : string;
    Prompt?             : string;
    Variables?          : string;
    CreatedByUserId?    : string;
    Temperature?        : number;
    FrequencyPenalty?   : number;
    TopP?               : number;
    PresencePenalty?    : number;
    IsActive?           : boolean;
}
export interface LlmPromptVersionSearchResults extends BaseSearchResults {
    Items: LlmPromptVersionDto[];
}
