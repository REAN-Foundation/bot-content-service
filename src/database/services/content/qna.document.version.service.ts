import { QnaDocumentVersion } from '../../models/content/qna.document.version.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import {
    QnaDocumentVersionCreateModel,
    QnaDocumentVersionSearchFilters,
    QnaDocumentVersionSearchResults,
    QnaDocumentVersionUpdateModel,
} from '../../../domain.types/content/qna.document.version.domain.types';
import { QnaDocumentVersionDto } from '../../../domain.types/content/qna.document.version.domain.types';
import { QnaDocumentVersionMapper } from '../../mappers/content/qna.document.version.mapper';
import { QnaDocument } from '../../models/content/qna.document.model';

///////////////////////////////////////////////////////////////////////
export class QnaDocumentVersionService extends BaseService {

    _qnaDocumentVersionRepository: Repository<QnaDocumentVersion> = Source.getRepository(QnaDocumentVersion);

    _documentRepository: Repository<QnaDocument> = Source.getRepository(QnaDocument);

    _qnaDocumentRepository: Repository<QnaDocument> = Source.getRepository(QnaDocument);

    public create = async (createModel: QnaDocumentVersionCreateModel): Promise<QnaDocumentVersionDto> => {
        try {
            const version = this._qnaDocumentVersionRepository.create({
                Version                  : createModel.Version,
                Name                     : createModel.Name,
                Description              : createModel.Description,
                Keyword                  : createModel.Keyword,
                ChunkingStrategy         : createModel.ChunkingStrategy,
                ChunkingLength           : createModel.ChunkingLength,
                ChunkOverlap             : createModel.ChunkOverlap,
                Splitter                 : createModel.Splitter,
                IsActive                 : createModel.IsActive,
                DocumentType             : createModel.DocumentType,
                DocumentSource           : createModel.DocumentSource,
                ParentDocumentResourceId : createModel.ParentDocumentResourceId,
                CreatedByUserId          : createModel.CreatedByUserId,
                ResourceId               : createModel.ResourceId,
                QnaDocument              : {
                    id : createModel.QnaDocumentId
                }
            });
            var record = await this._qnaDocumentVersionRepository.save(version);
            return QnaDocumentVersionMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public update = async (id: uuid, model: QnaDocumentVersionUpdateModel): Promise<QnaDocumentVersionDto> => {
        try {
            const documentversion = await this._qnaDocumentVersionRepository.findOne({
                where : {
                    id : id,
                },
                relations : {
                    QnaDocument : true,
                },
            });
            if (!documentversion) {
                ErrorHandler.throwNotFoundError('Document version not found!');
            }

            if (model.Name) {
                documentversion.Name = model.Name;
            }
            if (model.Description) {
                documentversion.Description = model.Description;
            }
            if (model.Keyword) {
                documentversion.Keyword = model.Keyword;
            }
            if (model.ChunkingStrategy) {
                documentversion.ChunkingStrategy = model.ChunkingStrategy;
            }
            if (model.ChunkingLength) {
                documentversion.ChunkingLength = model.ChunkingLength;
            }
            if (model.ChunkOverlap) {
                documentversion.ChunkOverlap = model.ChunkOverlap;
            }
            if (model.Splitter) {
                documentversion.Splitter = model.Splitter;
            }
            if (model.DocumentSource) {
                documentversion.DocumentSource = model.DocumentSource;
            }
            if (model.IsActive) {
                documentversion.IsActive = model.IsActive;
            }
            var record = await this._qnaDocumentVersionRepository.save(documentversion);
            return QnaDocumentVersionMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: uuid): Promise<QnaDocumentVersionDto> => {
        try {
            var documentversion = await this._qnaDocumentVersionRepository.findOne({
                relations : {
                    QnaDocument : true,
                },
                where : {
                    id : id,
                },
            });
            return QnaDocumentVersionMapper.toResponseDto(documentversion);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getLatestDocumentVersionByDocumentId = async (documentId: string): Promise<QnaDocumentVersionDto> => {
        try {
            var llmPrompt = await this._qnaDocumentVersionRepository.findOne({
                where : {
                    QnaDocument : {
                        id : documentId
                    },
                },
                order : {
                    Version : 'DESC'
                },
                relations : {
                    QnaDocument : true,
                }
            });
            return QnaDocumentVersionMapper.toResponseDto(llmPrompt);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: uuid) => {
        try {
            var result = await this._qnaDocumentVersionRepository.softDelete(id);
            result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: QnaDocumentVersionSearchFilters): Promise<QnaDocumentVersionSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._qnaDocumentVersionRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map((x) => QnaDocumentVersionMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    private getSearchModel = (filters: QnaDocumentVersionSearchFilters) => {
        var search: FindManyOptions<QnaDocumentVersion> = {
            relations : {
                QnaDocument : true
            },
            where  : {},
            select : {},
        };

        if (filters.Name) {
            search.where['Name'] = Like(`${filters.Name}`);
        }
        if (filters.Version) {
            search.where['Version'] = filters.Version;
        }
        if (filters.ResourceId) {
            search.where['ResourceId'] = filters.ResourceId;
        }
        if (filters.Keyword) {
            search.where['Keyword'] = Like(`${filters.Keyword}`);
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
        if (filters.IsActive) {
            search.where['IsActive'] = filters.IsActive;
        }
        if (filters.DocumentType) {
            search.where['DocumentType'] = filters.DocumentType;
        }
        if (filters.DocumentSource) {
            search.where['DocumentSource'] = filters.DocumentSource;
        }
        if (filters.ParentDocumentResourceId) {
            search.where['ParentDocumentResourceId'] = filters.ParentDocumentResourceId;
        }
        if (filters.CreatedByUserId) {
            search.where['CreatedByUserId'] = filters.CreatedByUserId;
        }
        if (filters.QnaDocumentId) {
            search.where['QnaDocumentId'] = filters.QnaDocumentId;
        }
        return search;
    };

}
