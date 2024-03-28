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
import { QnaDocumentVersionResponseDto } from '../../../domain.types/content/qna.document.version.domain.types';
import { QnaDocumentVersionMapper } from '../../mappers/content/qna.document.version.mapper';
import { QnaDocument } from '../../models/content/qna.document.model';

///////////////////////////////////////////////////////////////////////
export class QnaDocumentVersionService extends BaseService {

    _qnaDocumentVersionRepository: Repository<QnaDocumentVersion> = Source.getRepository(QnaDocumentVersion);

    _documentRepository: Repository<QnaDocument> = Source.getRepository(QnaDocument);

    _qnaDocumentRepository: Repository<QnaDocument> = Source.getRepository(QnaDocument);

    public create = async (createModel: QnaDocumentVersionCreateModel): Promise<QnaDocumentVersionResponseDto> => {
        try {
            const document = await this._documentRepository.findOne({
                where : { id: createModel.QnaDocumentId },
            });
            if (!document) {
                ErrorHandler.throwNotFoundError('Qna documentId cannot be found');
            }

            const version = this._qnaDocumentVersionRepository.create({
                VersionNumber  : createModel.VersionNumber,
                StorageUrl     : createModel.StorageUrl,
                DownloadUrl    : createModel.DownloadUrl,
                FileResourceId : createModel.FileResourceId,
                Keywords       : JSON.stringify(createModel.Keywords),

                Qna_Documents : document,
            });
            var record = await this._qnaDocumentVersionRepository.save(version);
            return QnaDocumentVersionMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public update = async (id: uuid, model: QnaDocumentVersionUpdateModel): Promise<QnaDocumentVersionResponseDto> => {
        try {
            const documentversion = await this._qnaDocumentVersionRepository.findOne({
                where : {
                    id : id,
                },
                relations : {
                    Qna_Documents : true,
                },
            });
            if (!documentversion) {
                ErrorHandler.throwNotFoundError('Document version not found!');
            }

            if (model.VersionNumber != null) {
                documentversion.VersionNumber = model.VersionNumber;
            }
            if (model.StorageUrl != null) {
                documentversion.StorageUrl = model.StorageUrl;
            }
            if (model.DownloadUrl != null) {
                documentversion.DownloadUrl = model.DownloadUrl;
            }
            if (model.FileResourceId != null) {
                documentversion.FileResourceId = model.FileResourceId;
            }
            if (model.Keywords != null) {
                documentversion.Keywords = JSON.stringify(model.Keywords);
            }

            var record = await this._qnaDocumentVersionRepository.save(documentversion);
            return QnaDocumentVersionMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: uuid): Promise<QnaDocumentVersionResponseDto> => {
        try {
            var documentversion = await this._qnaDocumentVersionRepository.findOne({
                relations : {
                    Qna_Documents : true,
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

    public getAll = async (): Promise<QnaDocumentVersionResponseDto[]> => {
        try {
            const data = [];
            var documentversion = await this._qnaDocumentVersionRepository.find({
                relations : {
                    Qna_Documents : true,
                },
            });
            for (var i of documentversion) {
                const record = QnaDocumentVersionMapper.toResponseDto(i);

                data.push(record);
            }
            return data;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to get Qna Document version record!', error);
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
            relations : {},
            where     : {},
            select    : {
                id             : true,
                VersionNumber  : true,
                StorageUrl     : true,
                DownloadUrl    : true,
                FileResourceId : true,
                Keywords       : true,
                Qna_Documents  : {
                    id   : true,
                    Name : true,
                },
            },
        };

        if (filters.VersionNumber) {
            search.where['VersionNumber'] = Like(`${filters.VersionNumber}`);
        }
        // if (filters.QnaDocumentId) {
        //     search.where['QnaDocumentId'] = filters.QnaDocumentId;
        // }
        if (filters.StorageUrl) {
            search.where['StorageUrl'] = filters.StorageUrl;
        }
        if (filters.DownloadUrl) {
            search.where['DownloadUrl'] = filters.DownloadUrl;
        }
        if (filters.FileResourceId) {
            search.where['FileResourceId'] = filters.FileResourceId;
        }

        if (filters.keywords) {
            search.where['Keywords'] = filters.keywords;
        }
        return search;
    };

}
