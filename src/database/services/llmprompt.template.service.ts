import { BaseService } from "./base.service";
import { ErrorHandler } from "../../common/handlers/error.handler";
import {
    LlmPromptCreateTemplateModel,
    LlmPromptTemplateDto,
    LlmPromptUpdateTemplateModel,
    LlmPromptTemplateSearchFilters,
    LlmPromptTemplateSearchResults,
} from "../../domain.types/llm.prompt/llm.prompt.templates.domain.types";
import { LlmPromptTemplates } from "../models/llm.prompt/llm.prompt.templates.model";
import { logger } from "../../logger/logger";
import { Source } from "../database.connector";
import { Repository } from "typeorm/repository/Repository";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { FindManyOptions, Like } from "typeorm";

export class LlmPromptTemplateService extends BaseService {

    _llmPromptTemplateRepository: Repository<LlmPromptTemplates> = Source.getRepository(LlmPromptTemplates);

    public create = async (createModel: LlmPromptCreateTemplateModel)
        : Promise<LlmPromptTemplateDto> => {
        try {
            const data = this._llmPromptTemplateRepository.create({
                Name            : createModel.Name,
                Description     : createModel.Description,
                Content         : createModel.Content,
                Variables       : createModel.Variables,
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
            if (model.Variables) {
                updateData.Variables = model.Variables;
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

    public getAll = async (): Promise<LlmPromptTemplateDto[]> => {
        try {
            const data = [];
            var promptTemplates = await this._llmPromptTemplateRepository.find();
            for (var i of promptTemplates ) {
                data.push(i);
            }
            return data;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to get llm promt template records', error);
        }
    };

    public getByStatus = async ( status: boolean ) => {
        try {
            var promptTemplates = await this._llmPromptTemplateRepository.find({
                where : {
                    IsActive : status,
                },
            });
            return promptTemplates;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to get Llm prompt template records!', error);
        }
    };

    public search = async(filters: LlmPromptTemplateSearchFilters)
    : Promise<LlmPromptTemplateSearchResults> => {
        try {
            const search: any = {
                where : {},
                order : {},
            };
            
            if (filters.Name) {
                search.where.Name = Like(`%${filters.Name}%`);
            }
            if (filters.Description) {
                search.where.Description = Like(`%${filters.Description}%`);
            }
            if (filters.Content) {
                search.where.Content = Like(`%${filters.Content}%`);
            }
            if (filters.Version) {
                search.where.Version = filters.Version;
            }
            if (filters.TenantId) {
                search.where.TenantId = filters.TenantId;
            }
            if (filters.Type) {
                search.where.Type = filters.Type;
            }
            if (filters.Category) {
                search.where.Category = filters.Category;
            }
            if (filters.SubGroup) {
                search.where.SubGroup = filters.SubGroup;
            }
            if (filters.IsActive !== null || filters.IsActive !== undefined) {
                search.where.IsActive = filters.IsActive;
            }
            if (filters.CreatedByUserId) {
                search.where.CreatedByUserId = filters.CreatedByUserId;
            }

            let orderByColum = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search.order[orderByColum] = order;

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['take'] = limit;
            search['skip'] = offset;

            const [list, count] = await this._llmPromptTemplateRepository.findAndCount(search);

            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : list
            };

            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._llmPromptTemplateRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!record) {
                return false;
            }
            record.DeletedAt = new Date();
            await this._llmPromptTemplateRepository.save(record);
            return true;
        } catch (error) {
            logger.error(error.message);
            throw new Error('Unable to delete prompt template.');
        }
    };

    private getSearchModel = (filters: LlmPromptTemplateSearchFilters) => {
        var search : FindManyOptions<LlmPromptTemplates> = {
            relations : {
            },
            where : {
            },
            select : {
                id              : true,
                Name            : true,
                Description     : true,
                Content         : true,
                Version         : true,
                TenantId        : true,
                Type            : true,
                Category        : true,
                SubGroup        : true,
                IsActive        : true,
                CreatedByUserId : true,
            }
        };

        if (filters.Name) {
            search.where['Name'] = Like(`%${filters.Name}%`);
        }
        if (filters.Description) {
            search.where['Description'] = Like(`%${filters.Description}%`);
        }
        if (filters.Content) {
            search.where['Content'] = Like(`%${filters.Content}%`);
        }
        if (filters.Version) {
            search.where['Version'] = filters.Version;
        }
        if (filters.TenantId) {
            search.where['TenantId'] = filters.TenantId;
        }
        if (filters.Type) {
            search.where['Type'] = Like(`%${filters.Type}%`);
        }
        if (filters.Category) {
            search.where['Category'] = Like(`%${filters.Category}%`);
        }
        if (filters.SubGroup) {
            search.where['SubGroup'] = Like(`%${filters.SubGroup}%`);
        }
        if (filters.IsActive) {
            search.where['IsActive'] = filters.IsActive;
        }
        if (filters.CreatedByUserId) {
            search.where['CreatedByUserId'] = filters.CreatedByUserId;
        }
        
        return search;
    };
}
