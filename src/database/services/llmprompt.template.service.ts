import { BaseService } from "./base.service";
import { ErrorHandler } from "../../common/handlers/error.handler";
import { LlmPromptCreateTemplateModel, LlmPromptTemplateDto, LlmPromptUpdateTemplateModel } from "../../domain.types/llm.prompt/llm.prompt.templates.domain.types";
import { LlmPromptTemplates } from "../models/llm.prompt/llm.prompt.templates.model";
import { logger } from "../../logger/logger";
import { Source } from "../database.connector";
import { Repository } from "typeorm/repository/Repository";
import { uuid } from "../../domain.types/miscellaneous/system.types";

export class LlmPromptTemplateService extends BaseService {

    _llmPromptTemplateRepository: Repository<LlmPromptTemplates> = Source.getRepository(LlmPromptTemplates);

    public create = async (createModel: LlmPromptCreateTemplateModel)
        : Promise<LlmPromptTemplateDto> => {
        try {
            const data = this._llmPromptTemplateRepository.create({
                Name            : createModel.Name,
                Description     : createModel.Description,
                Content         : createModel.Content,
                Version         : createModel.Version,
                TenantId        : createModel.TenantId,
                Type            : createModel.Type,
                Category        : createModel.Category,
                SubGroup        : createModel.SubGroup,
                IsActive        : createModel.IsActive,
                CreatedByUserId : createModel.CreatedByUserId,
            });
            var record = await this._llmPromptTemplateRepository.save(data);
            return record;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: uuid): Promise<LlmPromptTemplateDto> => {
        try {
            var llmPromptTemplateId = await this._llmPromptTemplateRepository.findOne({
                where : {
                    id : id,
                },
            });
            return llmPromptTemplateId;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public update = async (id: uuid, model: LlmPromptUpdateTemplateModel)
    : Promise<LlmPromptTemplateDto> => {
        try {
            const updateData = await this._llmPromptTemplateRepository.findOne({
                where : {
                    id : id,
                }
            });
            if (!updateData) {
                ErrorHandler.throwNotFoundError("Llm Prompt Template Not Found");
            }
            if (model.Name) {
                updateData.Name = model.Name;
            }
            if (model.Description) {
                updateData.Description = model.Description;
            }
            if (model.Content) {
                updateData.Content = model.Content;
            }
            if (model.Version) {
                updateData.Version = model.Version;
            }
            if (model.TenantId) {
                updateData.TenantId = model.TenantId;
            }
            if (model.Type) {
                updateData.Type = model.Type;
            }
            if (model.Category) {
                updateData.Category = model.Category;
            }
            if (model.SubGroup) {
                updateData.SubGroup = model.SubGroup;
            }
            if (model.IsActive) {
                updateData.IsActive = model.IsActive;
            }
            if (model.CreatedByUserId) {
                updateData.CreatedByUserId = model.CreatedByUserId;
            }
            var record = await this._llmPromptTemplateRepository.save(updateData);
            return record;
        } catch (error) {
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };
}
