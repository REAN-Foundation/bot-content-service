import { FindManyOptions, Repository } from 'typeorm';
import { QnaDocumentGroup } from '../../../database/models/content/qna.document.groups.model';
import { QnaDocument } from '../../../database/models/content/qna.document.model';
import { BaseService } from '../base.service';
import { Source } from '../../../database/database.connector';
import { QnaDocumentGroupCreateModel, QnaDocumentGroupDto, QnaDocumentGroupSearchFilters, QnaDocumentGroupSearchResults, QnaDocumentGroupUpdateModel } from '../../../domain.types/content/qna.document.group.domain.types';
import { QnaDocumentGroupMapper } from '../../../database/mappers/content/qna.document.group.mapper';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { logger } from '../../../logger/logger';

export class QnaDocumentGroupService extends BaseService {

    _qnaDocumentGroupRepository: Repository<QnaDocumentGroup> = Source.getRepository(QnaDocumentGroup);

    _qnaDocumentRepository: Repository<QnaDocument> = Source.getRepository(QnaDocument);

    create = async (createModel: QnaDocumentGroupCreateModel): Promise<QnaDocumentGroupDto> => {
        try {
            const data = await this._qnaDocumentGroupRepository.create({
                Name        : createModel.Name,
                Description : createModel.Description,
            });
            const record = await this._qnaDocumentGroupRepository.save(data);
            return QnaDocumentGroupMapper.toResponseDto(record);
        } catch (error) {
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public update = async (id: uuid, model: QnaDocumentGroupUpdateModel)
    : Promise<QnaDocumentGroupDto> => {
        try {
            const updateData = await this._qnaDocumentGroupRepository.findOne({
                where : {
                    id : id
                },
            });
            if (!updateData) {
                ErrorHandler.throwNotFoundError('Qna document group not found!');
            }
            if (model.Name) {
                updateData.Name = model.Name;
            }
            if ( model.Description) {
                updateData.Description = model.Description;
            }
            var record = await this._qnaDocumentGroupRepository.save(updateData);
            return QnaDocumentGroupMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: uuid): Promise<QnaDocumentGroupDto> => {
        try {
            var record = await this._qnaDocumentGroupRepository.findOne({
                where : {
                    id : id
                },
            });
            return QnaDocumentGroupMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._qnaDocumentGroupRepository.findOne({
                where : {
                    id : id
                },
            });
            if (!record) {
                return false; // Record not found
            }
            record.DeletedAt = new Date(); // Soft delete
            await this._qnaDocumentGroupRepository.save(record);
            return true; // Soft delete successful
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: QnaDocumentGroupSearchFilters)
    : Promise<QnaDocumentGroupSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._qnaDocumentGroupRepository.findAndCount(search);

            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => QnaDocumentGroupMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    private getSearchModel = (filters: QnaDocumentGroupSearchFilters) => {

        var search : FindManyOptions<QnaDocumentGroup> = {
            relations : {},
            where     : {},
        };

        if (filters.Name) {
            search.where['Name'] = filters.Name;
        }
        return search;
    };

}

