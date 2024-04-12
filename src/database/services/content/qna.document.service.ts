import { QnaDocument } from '../../models/content/qna.document.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import {
    QnaDocumentCreateModel,
    QnaDocumentSearchFilters,
    QnaDocumentSearchResults,
    QnaDocumentUpdateModel,
} from '../../../domain.types/content/qna.document.domain.types';
import { QnaDocumentResponseDto } from '../../../domain.types/content/qna.document.domain.types';
import { QnaDocumentMapper } from '../../mappers/content/qna.document.mapper';

///////////////////////////////////////////////////////////////////////

export class QnaDocumentService extends BaseService {

    _qnaDocumentRepository: Repository<QnaDocument> = Source.getRepository(QnaDocument);

    public create = async (createModel: QnaDocumentCreateModel): Promise<QnaDocumentResponseDto> => {
        try {
            const document = this._qnaDocumentRepository.create({
                Name                  : createModel.Name,
                Description           : createModel.Description,
                FileName              : createModel.FileName,
                Source                : createModel.Source,
                ParentDocument        : createModel.ParentDocument,
                ParentDocumentVersion : createModel.ParentDocumentVersion,
                ChunkingStrategy      : createModel.ChunkingStrategy,
                ChunkingLenght        : createModel.ChunkingLenght,
                ChunkOverlap          : createModel.ChunkOverlap,
                Splitter              : createModel.Splitter,
                IsActive              : createModel.IsActive,
                CreatedBy             : createModel.CreatedBy,
            });
            var record = await this._qnaDocumentRepository.save(document);
            return QnaDocumentMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public update = async (id: uuid, model: QnaDocumentUpdateModel): Promise<QnaDocumentResponseDto> => {
        try {
            const document = await this._qnaDocumentRepository.findOne({
                where : {
                    id : id,
                },
            });
            if (!document) {
                ErrorHandler.throwNotFoundError('Document not found!');
            }

            if (model.Name != null) {
                document.Name = model.Name;
            }
            if (model.Description != null) {
                document.Description = model.Description;
            }
            if (model.FileName != null) {
                document.FileName = model.FileName;
            }
            if (model.Source != null) {
                document.Source = model.Source;
            }
            if (model.ParentDocument != null) {
                document.ParentDocument = model.ParentDocument;
            }
            if (model.ParentDocumentVersion != null) {
                document.ParentDocumentVersion = model.ParentDocumentVersion;
            }
            if (model.ChunkingStrategy != null) {
                document.ChunkingStrategy = model.ChunkingStrategy;
            }
            if (model.ChunkingLenght != null) {
                document.ChunkingLenght = model.ChunkingLenght;
            }
            if (model.ChunkOverlap != null) {
                document.ChunkOverlap = model.ChunkOverlap;
            }
            if (model.Splitter != null) {
                document.Splitter = model.Splitter;
            }
            if (model.IsActive != null) {
                document.IsActive = model.IsActive;
            }
            if (model.CreatedBy != null) {
                document.CreatedBy = model.CreatedBy;
            }
            var record = await this._qnaDocumentRepository.save(document);
            return QnaDocumentMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: uuid): Promise<QnaDocumentResponseDto> => {
        try {
            var document = await this._qnaDocumentRepository.findOne({
                where : {
                    id : id,
                },
            });
            return QnaDocumentMapper.toResponseDto(document);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getByStatus = async (status: boolean) => {
        try {
            var document = await this._qnaDocumentRepository.find({
                where : {
                    IsActive : status,
                },
            });
            return QnaDocumentMapper.toArrayDto(document);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getAll = async (): Promise<QnaDocumentResponseDto[]> => {
        try {
            var document = await this._qnaDocumentRepository.find();
            return QnaDocumentMapper.toArrayDto(document);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var result = await this._qnaDocumentRepository.softDelete(id);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: QnaDocumentSearchFilters): Promise<QnaDocumentSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._qnaDocumentRepository.findAndCount(search);

            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map((x) => QnaDocumentMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    private getSearchModel = (filters: QnaDocumentSearchFilters) => {
        var search: FindManyOptions<QnaDocument> = {
            relations : {},
            where     : {},
            select    : {
                Name                  : true,
                Description           : true,
                FileName              : true,
                Source                : true,
                ParentDocument        : true,
                ParentDocumentVersion : true,
                ChunkingStrategy      : true,
                ChunkingLenght        : true,
                ChunkOverlap          : true,
                Splitter              : true,
                IsActive              : true,
                CreatedBy             : true,
            },
        };

        if (filters.Name) {
            search.where['Name'] = Like(`%${filters.Name}%`);
        }
        if (filters.Description) {
            search.where['Description'] = filters.Description;
        }
        if (filters.FileName) {
            search.where['FileName'] = filters.FileName;
        }
        if (filters.Source) {
            search.where['Source'] = filters.Source;
        }
        if (filters.ParentDocument) {
            search.where['ParentDocument'] = filters.ParentDocument;
        }
        if (filters.ParentDocumentVersion) {
            search.where['ParentDocumentVersion'] = filters.ParentDocumentVersion;
        }
        if (filters.ChunkingStrategy) {
            search.where['ChunkingStrategy'] = filters.ChunkingStrategy;
        }
        if (filters.ChunkingLenght) {
            search.where['ChunkingLenght'] = filters.ChunkingLenght;
        }
        if (filters.ChunkOverlap) {
            search.where['ChunkOverlap'] = filters.ChunkOverlap;
        }
        if (filters.Splitter) {
            search.where['Splitter'] = filters.Splitter;
        }
        if (filters.IsActive) {
            search.where['IsActive'] = filters.IsActive;
        }
        if (filters.CreatedBy) {
            search.where['CreatedBy'] = filters.CreatedBy;
        }
        return search;
    };

}
