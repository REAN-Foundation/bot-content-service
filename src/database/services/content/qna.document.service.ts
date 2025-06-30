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
import { QnaDocumentDto } from '../../../domain.types/content/qna.document.domain.types';
import { QnaDocumentMapper } from '../../mappers/content/qna.document.mapper';
import { FileResource } from '../../models/file.resource/file.resource.model';

///////////////////////////////////////////////////////////////////////

export class QnaDocumentService extends BaseService {

    _qnaDocumentRepository: Repository<QnaDocument> = Source.getRepository(QnaDocument);

    _fileResourceRepository : Repository<FileResource> = Source.getRepository(FileResource);

    public create = async (createModel: QnaDocumentCreateModel): Promise<QnaDocumentDto> => {
        try {
            const document = this._qnaDocumentRepository.create({
                Name                     : createModel.Name,
                Description              : createModel.Description,
                Keyword                  : createModel.Keyword,
                ChunkingStrategy         : createModel.ChunkingStrategy,
                ChunkingLength           : createModel.ChunkingLength,
                ChunkOverlap             : createModel.ChunkOverlap,
                Splitter                 : createModel.Splitter,
                IsActive                 : createModel.IsActive,
                DocumentType             : createModel.DocumentType,
                ParentDocumentResourceId : createModel.ParentDocumentResourceId,
                CreatedByUserId          : createModel.CreatedByUserId,
                FileResource             : {
                    id : createModel.ResourceId
                }
            });

            var record = await this._qnaDocumentRepository.save(document);
            return QnaDocumentMapper.toResponseDto(record);

        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public update = async (id: uuid, model: QnaDocumentUpdateModel): Promise<QnaDocumentDto> => {
        try {
            const document = await this._qnaDocumentRepository.findOne({
                where : {
                    id : id,
                },
                relations : {
                    FileResource : true,
                }
            });
            if (!document) {
                ErrorHandler.throwNotFoundError('Document not found!');
            }

            if (model.Name) {
                document.Name = model.Name;
            }
            if (model.Description) {
                document.Description = model.Description;
            }
            if (model.ResourceId) {
                document.FileResource.id = model.ResourceId;
            }
            if (model.Keyword || !model.Keyword) {
                document.Keyword = model.Keyword;
            }
            if (model.ChunkingStrategy) {
                document.ChunkingStrategy = model.ChunkingStrategy;
            }
            if (model.ChunkingLength) {
                document.ChunkingLength = model.ChunkingLength;
            }
            if (model.ChunkOverlap) {
                document.ChunkOverlap = model.ChunkOverlap;
            }
            if (model.Splitter) {
                document.Splitter = model.Splitter;
            }
            if (model.IsActive) {
                document.IsActive = model.IsActive;
            }
            if (model.DocumentType) {
                document.DocumentType = model.DocumentType;
            }

            var record = await this._qnaDocumentRepository.save(document);
            
            return QnaDocumentMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: uuid): Promise<QnaDocumentDto> => {
        try {
            var document = await this._qnaDocumentRepository.findOne({
                where : {
                    id : id,
                },
                relations : {
                    FileResource        : true,
                    QnaDocumentVersions : true,
                }
            });
            return QnaDocumentMapper.toResponseDto(document);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getByFileResourceId = async (id: uuid): Promise<QnaDocumentDto> => {
        try {
            var document = await this._qnaDocumentRepository.findOne({
                where : {
                    ParentDocumentResourceId : id
                },
            });
            return QnaDocumentMapper.toResponseDto(document);
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
            relations : {
                FileResource        : true,
                QnaDocumentVersions : true,
            },
            where : {},
        };

        if (filters.Name) {
            search.where['Name'] = Like(`%${filters.Name}%`);
        }
        if (filters.Keyword) {
            search.where['Keyword'] = Like(`%${filters.Keyword}%`);
        }
        if (filters.ResourceId) {
            search.where['FileResource'] = {
                id : filters.ResourceId
            };
        }
        if (filters.DocumentType) {
            search.where['DocumentType'] = filters.DocumentType;
        }
        if (filters.ParentDocumentResourceId) {
            search.where['ParentDocumentResourceId'] = filters.ParentDocumentResourceId;
        }
        if (filters.ChunkingStrategy) {
            search.where['ChunkingStrategy'] = filters.ChunkingStrategy;
        }
        if (filters.ChunkingLength) {
            search.where['ChunkingLength'] = filters.ChunkingLength;
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
        if (filters.CreatedByUserId) {
            search.where['CreatedByUserId'] = filters.CreatedByUserId;
        }
        return search;
    };

}
