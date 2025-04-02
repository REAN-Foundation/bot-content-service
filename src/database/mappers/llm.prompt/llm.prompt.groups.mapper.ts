import { LlmPromptGroupDto } from "../../../domain.types/llm.prompt/llm.prompt.group.domain.types";
import { LlmPromptGroup } from "../../models/llm.prompt/llm.prompt.groups.model";
export class LlmPromptGroupMapper {

    static toResponseDto = (llmpromptgroup: LlmPromptGroup): LlmPromptGroupDto => {
        if (llmpromptgroup == null) {
            return null;
        }
        const dto: LlmPromptGroupDto = {
            id          : llmpromptgroup.id,
            Name        : llmpromptgroup.Name,
            Description : llmpromptgroup.Description,
        };
        return dto;
    };

}
