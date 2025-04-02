import { LlmPromptVersionDto } from "../../../domain.types/llm.prompt/llm.prompt.version.domain.types";
import { LlmPromptVersion } from "../../models/llm.prompt/llm.prompt.versions.model";

export class LlmPromptVersionMapper {

    static toResponseDto = (llmpromptversion:LlmPromptVersion): LlmPromptVersionDto => {
        if (llmpromptversion == null) {
            return null;
        }
        const dto: LlmPromptVersionDto = {
            id               : llmpromptversion.id,
            PromptId         : llmpromptversion.LlmPrompt.id,
            Version          : llmpromptversion.Version,
            Name             : llmpromptversion.Name,
            Description      : llmpromptversion.Description,
            UseCaseType      : llmpromptversion.UseCaseType,
            Group            : llmpromptversion.Group,
            Model            : llmpromptversion.Model,
            Prompt           : llmpromptversion.Prompt,
            Variables        : llmpromptversion.Variables,
            CreatedByUserId  : llmpromptversion.CreatedByUserId,
            Temperature      : llmpromptversion.Temperature,
            FrequencyPenalty : llmpromptversion.FrequencyPenalty,
            TopP             : llmpromptversion.TopP,
            PresencePenalty  : llmpromptversion.PresencePenalty,
            IsActive         : llmpromptversion.IsActive
        };
        return dto;
    };

}
