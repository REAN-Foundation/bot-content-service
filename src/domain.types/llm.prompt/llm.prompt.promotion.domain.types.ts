///////////////////////////////////////////////////////////////////////////////

export interface LlmPromptVersionExport {
    Version          : number;
    Name             : string;
    Description      : string;
    UseCaseType      : string;
    Group            : string;
    Model            : string;
    Prompt           : string;
    Variables        : string;
    CreatedByUserId  : string;
    Score            : number;
    Temperature      : number;
    FrequencyPenalty : number;
    TopP             : number;
    PresencePenalty  : number;
    IsActive         : boolean;
    PublishedAt      : Date;
}

export interface LlmPromptExport {
    PromptCode       : string;
    Name             : string;
    Description      : string;
    UseCaseType      : string;
    Group            : string;
    Model            : string;
    Prompt           : string;
    Variables        : string;
    CreatedByUserId  : string;
    Temperature      : number;
    FrequencyPenalty : number;
    TopP             : number;
    PresencePenalty  : number;
    IsActive         : boolean;
    TenantId         : string;
    Versions         : LlmPromptVersionExport[];
}

export interface LlmPromptPromotionPayload {
    TenantId          : string;
    TargetEnvironment : string;
    LlmPrompt         : LlmPromptExport;
}

export interface LlmPromptPromoteFromRequestDto {
    TenantId          : string;
    TargetEnvironment : string;
}

export interface LlmPromptPromoteToRequestDto {
    TenantId  : string;
    LlmPrompt : LlmPromptExport;
}

export interface LlmPromptPromotionResult {
    action    : string;
    llmPrompt : any;
    message   : string;
}

export interface LlmPromptPromotionFromResponse {
    PromptCode        : string;
    PromptName        : string;
    TenantId          : string;
    TargetEnvironment : string;
    InitiatedAt       : Date;
    VersionCount      : number;
    Message           : string;
}
