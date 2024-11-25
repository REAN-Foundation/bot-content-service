import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { decimal, uuid } from "../miscellaneous/system.types";

export interface  LlmPromptCreateModel {
    Name              : string;
    Description?      : string;
    UseCaseType       : string;
    Group             : string;
    Model         : string;
    Prompt: string;
    Variables: string;
    CreatedByUserId            : string;
    Temperature       : decimal;
    FrequencyPenalty : decimal;
    TopP              : decimal;
    PresencePenalty   : decimal;
    IsActive          : boolean;
}
export interface LlmPromptUpdateModel {
    Name?              : string;
    Description?       : string;
    UseCaseType?       : string;
    Group?      : string;
    Model?         : string;
    Prompt?: string;
    Variables?: string;
    CreatedByUserId?            : string;
    Temperature?       : decimal;
    FrequencyPenalty? : decimal;
    TopP?              : decimal;
    PresencePenalty?   : decimal;
    IsActive?          : boolean;
}
export interface LlmPromptDto {
    id                : uuid;
    Name              : string;
    Description       : string;
    UseCaseType       : string;
    Group         : string;
    Model         : string;
    Prompt: string;
    Variables: string;
    CreatedByUserId            : string;
    Temperature       : decimal;
    FrequencyPenalty : decimal;
    TopP              : decimal;
    PresencePenalty   : decimal;
    IsActive          : boolean;
}
export interface LlmPromptSearchFilters extends BaseSearchFilters {
    id?                : uuid;
    Name?               : string;
    UseCaseType?        : string;
    Group?          : string;
    Model?          : string;
    Prompt?: string;
    Variables?: string;
    CreatedByUserId?             : string;
    Temperature?        : decimal;
    FrequencyPenalty?  : decimal;
    TopP?               : decimal;
    PresencePenalty?    : decimal;
    IsActive?           : boolean;
}
export interface LlmPromptInputStructure {
    introduction:   string,
    instruction?:   string,
    guidelines?:    string
}
export interface LlmPromptTemplateStructure {
    introduction?:  string,
    userQuery?:     string,
    responseFormat?: string,
    instruction?:   string,
    guidelines?:    string,
    chatHistory?:   string,
    similarDocs?:   string
}
export interface LlmOutputSchema {
    answer: string,
    intent: string,
    detectedLanguage: string,
    sourceOfInfo: string
}
export interface LlmPromptSearchResults extends BaseSearchResults {
    Items: LlmPromptDto[];
}
