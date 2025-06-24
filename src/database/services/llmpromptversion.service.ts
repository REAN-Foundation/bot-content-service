import { BaseService } from './base.service';
import { logger } from '../../logger/logger';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { Source } from '../database.connector';
import { Repository } from 'typeorm/repository/Repository';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { LlmPromptVersion } from '../models/llm.prompt/llm.prompt.versions.model';
import { LlmPromptVersionCreateModel, LlmPromptVersionSearchFilters, LlmPromptVersionSearchResults } from '../../domain.types/llm.prompt/llm.prompt.version.domain.types';
import { LlmPromptVersionUpdateModel } from '../../domain.types/llm.prompt/llm.prompt.version.domain.types';
import { LlmPromptVersionDto } from '../../domain.types/llm.prompt/llm.prompt.version.domain.types';
import { LlmPromptVersionMapper } from '../mappers/llm.prompt/llm.prompt.version.mapper';
import { FindManyOptions, Like } from 'typeorm';
import { LlmPrompt } from '../models/llm.prompt/llm.prompts.model';

export class LlmpromptVersionService extends BaseService {

    _llmPromptVersionRepository: Repository<LlmPromptVersion> = Source.getRepository(LlmPromptVersion);

    _llmPromptRepository: Repository<LlmPrompt> = Source.getRepository(LlmPrompt);

    public create = async (createModel: LlmPromptVersionCreateModel)
        : Promise<LlmPromptVersionDto> => {
        try {
            const promptRecord = await this._llmPromptRepository.findOne({
                where : {
                    id : createModel.PromptId
                }
            });
            if (!promptRecord) {
                ErrorHandler.throwNotFoundError('PromptId cannot be found');
            }

            const data = this. _llmPromptVersionRepository.create({
                Version          : createModel.Version,
                LlmPrompt        : promptRecord,
                Score            : createModel.Score,
                Name             : createModel.Name,
                Description      : createModel.Description ?? null,
                UseCaseType      : createModel.UseCaseType,
                Group            : createModel.Group ?? 'Default',
                Model            : createModel.Model,
                Prompt           : createModel.Prompt,
                Variables        : createModel.Variables ? JSON.stringify(createModel.Variables) : null,
                CreatedByUserId  : createModel.CreatedByUserId,
                Temperature      : createModel.Temperature,
                FrequencyPenalty : createModel.FrequencyPenalty,
                TopP             : createModel.TopP,
                PresencePenalty  : createModel.PresencePenalty,
                IsActive         : createModel.IsActive,
            });
            var record = await this._llmPromptVersionRepository.save(data);
            return LlmPromptVersionMapper.toResponseDto(record);
        }
        catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };
    
    public update = async (id: uuid, model: LlmPromptVersionUpdateModel)
    : Promise<LlmPromptVersionDto> => {
        try {
            const updateData = await this._llmPromptVersionRepository.findOne({
                where : {
                    id : id
                },
                relations : {
                    LlmPrompt : true,
                }
            });
            if (!updateData) {
                ErrorHandler.throwNotFoundError('LLm prompt version not found!');
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
                updateData.Variables = model.Variables;
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
            if ( model.Score) {
                updateData.Score = model.Score;
            }
            if ( model.PublishedAt) {
                updateData.PublishedAt = model.PublishedAt;
            }
                  
            var record = await this._llmPromptVersionRepository.save(updateData);
            return LlmPromptVersionMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: uuid): Promise<LlmPromptVersionDto> => {
        try {
            var llmPromptVersionId = await this._llmPromptVersionRepository.findOne({
                where : {
                    id : id
                },
                relations : {
                    LlmPrompt : true,
                }
            });
            return LlmPromptVersionMapper.toResponseDto(llmPromptVersionId);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getLatestPromptVersionByPromptId = async (promptId: string): Promise<LlmPromptVersionDto> => {
        try {
            var llmPrompt = await this._llmPromptVersionRepository.findOne({
                where : {
                    LlmPrompt : {
                        id : promptId
                    }
                },
                order : {
                    Version : 'DESC'
                }
            });
            return LlmPromptVersionMapper.toResponseDto(llmPrompt);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._llmPromptVersionRepository.findOne({
                where : {
                    id : id
                },
                relations : {
                    LlmPrompt : true,
                }
            });
            if (!record) {
                return false; // Record not found
            }
            record.DeletedAt = new Date(); // Soft delete
            await this._llmPromptVersionRepository.save(record);
            return true; // Soft delete successful
        } catch (error) {
            logger.error(error.message);
            throw new Error('Unable to delete prompt version.');
        }
    };

    public search = async (filters: LlmPromptVersionSearchFilters)
    : Promise<LlmPromptVersionSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._llmPromptVersionRepository.findAndCount(search);

            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => LlmPromptVersionMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    private getSearchModel = (filters: LlmPromptVersionSearchFilters) => {

        var search : FindManyOptions<LlmPromptVersion> = {
            where : {
            },
            relations : {
            
            },
            select : {}
            
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
            search.where['PresencePenalty'] = filters.PresencePenalty ;
        }
        if (filters.IsActive ) {
            search.where['IsActive'] = filters.IsActive ;
        }
        if (filters.Version) {
            search.where['Version'] = Like(`%${filters.Version}%`);
        }
        if (filters.Variables) {
            search.where['Variables'] = filters.Variables;
        }
        if (filters.Score) {
            search.where['Score'] = filters.Score;
        }
        if (filters.PublishedAt) {
            search.where['PublishedAt'] = filters.PublishedAt;
        }
        if (filters.PromptId) {
            search.where['LlmPrompt'] = {
                id : filters.PromptId
            };
        }
        return search;
    };

}
