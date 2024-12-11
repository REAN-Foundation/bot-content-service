import { LlmPrompt } from "../../models/llm.prompt/llm.prompts.model";
import { LlmPromptDto } from "../../../domain.types/llm.prompt/llm.prompt.domain.types";
import { Templates } from "../../../domain.types/llm.prompt/llm.prompt.domain.types";

export class LlmPromptMapper {

    static toResponseDto = (llmprompts:LlmPrompt): LlmPromptDto => {
        if (llmprompts == null) {
            return null;
        }
        const dto: LlmPromptDto = {
            id               : llmprompts.id,
            Name             : llmprompts.Name,
            Description      : llmprompts.Description,
            UseCaseType      : llmprompts.UseCaseType,
            Group            : llmprompts.Group,
            Model            : llmprompts.Model,
            Prompt           : llmprompts.Prompt,
            Variables        : llmprompts.Variables,
            CreatedByUserId  : llmprompts.CreatedByUserId,
            Temperature      : llmprompts.Temperature,
            FrequencyPenalty : llmprompts.FrequencyPenalty,
            TopP             : llmprompts.TopP,
            PresencePenalty  : llmprompts.PresencePenalty,
            IsActive         : llmprompts.IsActive,
        };
        return dto;
    };

    static toArrayDto (llmprompts:LlmPrompt[]): LlmPromptDto[] {
        if (llmprompts === null) {
            return null;
        }

        const dto: LlmPromptDto[] = [];

        llmprompts.forEach((element) => {
            dto.push({
                id               : element.id,
                Name             : element.Name,
                Description      : element.Description,
                UseCaseType      : element.UseCaseType,
                Group            : element.Group,
                Model            : element.Model,
                Prompt           : element.Prompt,
                Variables        : element.Variables,
                CreatedByUserId  : element.CreatedByUserId,
                Temperature      : element.Temperature,
                FrequencyPenalty : element.FrequencyPenalty,
                TopP             : element.TopP,
                PresencePenalty  : element.PresencePenalty,
                IsActive         : element.IsActive
            });
        });
        return dto;
    }
    
}
