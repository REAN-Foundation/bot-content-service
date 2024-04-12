import { QnaDocumentGroup } from '../../models/content/qna.document.groups.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import {
    QnaDocumentGroupCreateModel,
    QnaDocumentGroupSearchFilters,
    QnaDocumentGroupUpdateModel,
} from '../../../domain.types/content/qna.document.group.domain.types';
import { QnaDocumentGroupResponseDto } from '../../../domain.types/content/qna.document.group.domain.types';
import { QnaDocumentGroupsMapper } from '../../mappers/content/qna.document.group.mapper';
import { QnaDocument } from '../../models/content/qna.document.model';

///////////////////////////////////////////////////////////////////////

export class QnaDocumentGroupsService extends BaseService {

    _qnaDocumentGroupsRepository: Repository<QnaDocumentGroup> = Source.getRepository(QnaDocumentGroup);

    _qnaDocumentRepository: Repository<QnaDocument> = Source.getRepository(QnaDocument);

    public create = async (createModel: QnaDocumentGroupCreateModel): Promise<QnaDocumentGroupResponseDto> => {
        try {
            const document = await this.getDocumentById(createModel.QnaDocumentId);

            const data = this._qnaDocumentGroupsRepository.create({
                Name         : createModel.Name,
                Description  : createModel.Description,
                QnaDocuments : [document],
            });
            var record = await this._qnaDocumentGroupsRepository.save(data);
            return QnaDocumentGroupsMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public update = async (id: uuid, model: QnaDocumentGroupUpdateModel): Promise<QnaDocumentGroupResponseDto> => {
        try {
            const updateData = await this._qnaDocumentGroupsRepository.findOne({
                where : {
                    id : id,
                },
                relations : {
                    QnaDocuments : true,
                },
            });

            if (model.Name != null) {
                updateData.Name = model.Name;
            }
            if (model.Description != null) {
                updateData.Description = model.Description;
            }

            var record = await this._qnaDocumentGroupsRepository.save(updateData);
            return QnaDocumentGroupsMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    private async getDocumentById(id: uuid) {
        const document = await this._qnaDocumentRepository.findOne({
            where : {
                id : id,
            },
        });
        if (!document) {
            ErrorHandler.throwNotFoundError('Qna document cannot be found');
        }
        return document;
    }

    public getById = async (id: uuid) => {
        try {
            var qnaDocumentGroup = await this._qnaDocumentGroupsRepository.findOne({
                where : {
                    id : id,
                },
                relations : {
                    QnaDocuments : true,
                },
            });
            return QnaDocumentGroupsMapper.toResponseDto(qnaDocumentGroup);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getAll = async (): Promise<QnaDocumentGroupResponseDto[]> => {
        try {
            const data = [];
            var documentgroup = await this._qnaDocumentGroupsRepository.find({
                relations : {
                    QnaDocuments : true,
                },
            });
            for (var i of documentgroup) {
                const record = QnaDocumentGroupsMapper.toResponseDto(i);
                // const record = i;
                data.push(record);
            }
            return data;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to get Qna document group record!', error);
        }
    };

    public delete = async (id: uuid) => {
        try {
            var result = await this._qnaDocumentGroupsRepository.softDelete(id);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: QnaDocumentGroupSearchFilters): Promise<QnaDocumentGroupSearchFilters> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._qnaDocumentGroupsRepository.findAndCount(search);

            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map((x) => QnaDocumentGroupsMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    private getSearchModel = (filters: QnaDocumentGroupSearchFilters) => {
        var search: FindManyOptions<QnaDocumentGroup> = {
            relations : {},
            where     : {},
            select    : {
                id          : true,
                Name        : true,
                Description : true,
            },
        };

        if (filters.Name) {
            search.where['Name'] = Like(`%${filters.Name}%`);
        }

        return search;
    };
    
}
