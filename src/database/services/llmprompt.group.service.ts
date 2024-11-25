import { BaseService } from './base.service';
import { logger } from '../../logger/logger';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { Source } from '../database.connector';
import { Repository } from 'typeorm/repository/Repository';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { LlmPromptGroup } from '../models/llm.prompt/llm.prompt.groups.model';
import { LlmPromptGroupCreateModel, LlmPromptGroupSearchFilters, LlmPromptGroupSearchResults } from '../../domain.types/llm.prompt/llm.prompt.group.domain.types';
import { LlmPromptGroupDto } from '../../domain.types/llm.prompt/llm.prompt.group.domain.types';
import { LlmPromptGroupMapper } from '../mappers/llm.prompt/llm.prompt.groups.mapper';
import { LlmPromptGroupUpdateModel } from '../../domain.types/llm.prompt/llm.prompt.group.domain.types';
import { LlmPrompt } from '../models/llm.prompt/llm.prompts.model';
import { FindManyOptions } from 'typeorm';

export class LlmpromptGroupService extends BaseService {

    _llmPromptGroupRepository: Repository<LlmPromptGroup> = Source.getRepository(LlmPromptGroup);

    _llmPromptRepository: Repository<LlmPrompt> = Source.getRepository(LlmPrompt);

    create = async (createModel: LlmPromptGroupCreateModel): Promise<LlmPromptGroupDto> => {
        try {
            const data = await this._llmPromptGroupRepository.create({
                Name        : createModel.Name,
                Description : createModel.Description,
            });
            const record = await this._llmPromptGroupRepository.save(data);
            return LlmPromptGroupMapper.toResponseDto(record);
        } catch (error) {
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public update = async (id: uuid, model: LlmPromptGroupUpdateModel)
    : Promise<LlmPromptGroupDto> => {
        try {
            const updateData = await this._llmPromptGroupRepository.findOne({
                where : {
                    id : id
                },
            });
            if (!updateData) {
                ErrorHandler.throwNotFoundError('LLm prompt group not found!');
            }
            if (model.Name) {
                updateData.Name = model.Name;
            }
            if ( model.Description) {
                updateData.Description = model.Description;
            }
            var record = await this._llmPromptGroupRepository.save(updateData);
            return LlmPromptGroupMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: uuid): Promise<LlmPromptGroupDto> => {
        try {
            var llmPromptGroupId = await this._llmPromptGroupRepository.findOne({
                where : {
                    id : id
                },
            });
            return LlmPromptGroupMapper.toResponseDto(llmPromptGroupId);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._llmPromptGroupRepository.findOne({
                where : {
                    id : id
                },
            });
            if (!record) {
                return false; // Record not found
            }
            record.DeletedAt = new Date(); // Soft delete
            await this._llmPromptGroupRepository.save(record);
            return true; // Soft delete successful
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: LlmPromptGroupSearchFilters)
    : Promise<LlmPromptGroupSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._llmPromptGroupRepository.findAndCount(search);

            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => LlmPromptGroupMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    private getSearchModel = (filters: LlmPromptGroupSearchFilters) => {

        var search : FindManyOptions<LlmPromptGroup> = {
            relations : {},
            where     : {},
        };

        if (filters.Name) {
            search.where['Name'] = filters.Name;
        }
        return search;
    };

}
