import { BaseService } from './base.service';
import { LlmPrompt } from '../models/llm.prompt/llm.prompts.model';
import { LlmPromptMapper } from '../mappers/llm.prompt/llm.prompt.mapper';
import { logger } from '../../logger/logger';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { LlmPromptCreateModel, LlmPromptDto, LlmPromptSearchFilters, LlmPromptSearchResults, LlmPromptUpdateModel } from '../../domain.types/llm.prompt/llm.prompt.domain.types';
import { LlmPromptTemplateService } from './llmprompt.template.service';
import { Source } from '../database.connector';
import { Repository } from 'typeorm/repository/Repository';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { FindManyOptions, Like } from 'typeorm';
import { PromptGroup } from '../../domain.types/promptgroup.domain.types';

export class LlmpromptService extends BaseService {

    _llmPromptRepository: Repository<LlmPrompt> = Source.getRepository(LlmPrompt);

    _templateService: LlmPromptTemplateService = new LlmPromptTemplateService();

    public create = async (createModel: LlmPromptCreateModel)
        : Promise<LlmPromptDto> => {
        try {
            const templates = createModel.Templates || [];
            var finalPrompt = "";
            const variables = [];

            for (const template of templates) {
                const templateContent = await this._templateService.getById(template.TemplateId);
                const content = templateContent.Content;

                // let content = template.Content;
                variables.push(template.Variables);
                // for (const { VariableName, VariableContent } of template.Variables) {
                //     const placeholder = new RegExp(`{{${VariableName}}}`, "g");
                //     content = content.replace(placeholder, VariableContent);
                // }
            
                // Append the processed template to the finalPrompt
                finalPrompt += content + " ";
            }

            const data = this._llmPromptRepository.create({
                Name             : createModel.Name,
                Description      : createModel.Description ?? null,
                UseCaseType      : createModel.UseCaseType,
                Group            : createModel.Group as PromptGroup || PromptGroup.generic,
                Model            : createModel.Model,
                Prompt           : createModel.Prompt,
                Variables        : JSON.stringify(createModel.Variables || []),
                CreatedByUserId  : createModel.CreatedByUserId,
                Temperature      : createModel.Temperature,
                FrequencyPenalty : createModel.FrequencyPenalty,
                TopP             : createModel.TopP,
                PresencePenalty  : createModel.PresencePenalty,
                IsActive         : createModel.IsActive,
                TenantId         : createModel.TenantId
            });
            var record = await this._llmPromptRepository.save(data);
            return LlmPromptMapper.toResponseDto(record);
        }
        catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };
    
    public update = async (id: uuid, model: LlmPromptUpdateModel)
    : Promise<LlmPromptDto> => {
        try {
            const updateData = await this._llmPromptRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!updateData) {
                ErrorHandler.throwNotFoundError('LLm prompt not found!');
            }
            if (model.Name) {
                updateData.Name = model.Name;
            }
            if ( model.Description) {
                updateData.Description = model.Description;
            }
            if ( model.UseCaseType) {
                updateData.UseCaseType = model.UseCaseType;
            }
            if ( model.Group) {
                updateData.Group = model.Group;
            }
            if ( model.Model) {
                updateData.Model = model.Model;
            }
            if ( model.Prompt) {
                updateData.Prompt = model.Prompt;
            }
            if (model.Variables) {
                updateData.Variables = JSON.stringify(model.Variables);
            }
            if (  model.CreatedByUserId) {
                updateData.CreatedByUserId = model.CreatedByUserId;
            }
            if ( model.Temperature) {
                updateData.Temperature = model.Temperature;
            }
            if ( model.FrequencyPenalty) {
                updateData.FrequencyPenalty = model.FrequencyPenalty;
            }
            if ( model.TopP) {
                updateData.TopP = model.TopP;
            }
            if ( model.PresencePenalty) {
                updateData.PresencePenalty  = model.PresencePenalty;
            }
            if ( model.IsActive) {
                updateData.IsActive = model.IsActive;
            }
         
            var record = await this._llmPromptRepository.save(updateData);
            return LlmPromptMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: uuid): Promise<LlmPromptDto> => {
        try {
            var llmPromptId = await this._llmPromptRepository.findOne({
                where : {
                    id : id
                },
            });
            return LlmPromptMapper.toResponseDto(llmPromptId);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getByStatus = async (status: boolean) => {
        try {
            var prompt = await this._llmPromptRepository.find({
                where : {
                    IsActive : status,
                },
            });
            return LlmPromptMapper.toArrayDto(prompt);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getAll = async (): Promise<LlmPromptDto[]> =>{
        try {
            const data = [];
            var prompts = await this._llmPromptRepository.find();
            for (var i of prompts) {
                const record = LlmPromptMapper.toResponseDto(i);
                // const record = i;
                data.push(record);
            }
            return data;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to get Llm prompt record!', error);
        }
    };
    
    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._llmPromptRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!record) {
                return false;
            }
            record.DeletedAt = new Date();
            await this._llmPromptRepository.save(record);
            return true;
        } catch (error) {
            logger.error(error.message);
            throw new Error('Unable to delete prompt.');
        }
    };
    
    public search = async (filters: LlmPromptSearchFilters)
    : Promise<LlmPromptSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._llmPromptRepository.findAndCount(search);

            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => LlmPromptMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    private getSearchModel = (filters: LlmPromptSearchFilters) => {

        var search : FindManyOptions<LlmPrompt> = {
            relations : {
            },
            where : {
            },
            select : {
                id               : true,
                Name             : true,
                Description      : true,
                UseCaseType      : true,
                Group            : true,
                Model            : true,
                Prompt           : true,
                Variables        : true,
                CreatedByUserId  : true,
                Temperature      : true,
                FrequencyPenalty : true,
                TopP             : true,
                PresencePenalty  : true,
                IsActive         : true,
                TenantId         : true,
            }
        };

        if (filters.Name) {
            search.where['Name'] = Like(`%${filters.Name}%`);
        }
        if (filters.UseCaseType) {
            search.where['UseCaseType'] = filters.UseCaseType;
        }
        if (filters.Group) {
            search.where['Group'] = filters.Group;
        }
        if (filters.Model) {
            search.where['Model'] = filters.Model;
        }
        if (filters.Prompt) {
            search.where['Prompt'] = filters.Prompt;
        }
        if (filters.Variables) {
            search.where['Variables'] = filters.Variables;
        }
        if (filters.CreatedByUserId) {
            search.where['CreatedByUserId'] = filters.CreatedByUserId;
        }
        if (filters.Temperature) {
            search.where['Temperature'] = filters.Temperature;
        }
        if (filters.FrequencyPenalty) {
            search.where['FrequencyPenalty'] = filters.FrequencyPenalty;
        }
        if (filters.TopP) {
            search.where['TopP'] = filters.TopP;
        }
        if (filters.PresencePenalty ) {
            search.where['PresencePenalty'] = filters.PresencePenalty;
        }
        if (filters.IsActive ) {
            search.where['IsActive'] = filters.IsActive;
        }
        if (filters.TenantId) {
            search.where['TenantId'] = filters.TenantId;
        }
        return search;
    };

}
