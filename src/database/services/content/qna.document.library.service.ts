import { QnaDocumentLibrary } from '../../models/content/qna.document.library.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../database.connector';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import {
    QnaDocumentLibraryCreateModel,
    QnaDocumentLibrarySearchFilters,
    QnaDocumentLibrarySearchResults,
    QnaDocumentLibraryUpdateModel,
} from '../../../domain.types/content/qna.document.library.domain.types';
import { QnaDocumentLibraryDto } from '../../../domain.types/content/qna.document.library.domain.types';
import { QnaDocumentLibraryMapper } from '../../mappers/content/qna.document.library.mapper';

///////////////////////////////////////////////////////////////////////

export class QnaDocumentLibraryService extends BaseService {

    _qnaDocumentLibraryRepository: Repository<QnaDocumentLibrary> = Source.getRepository(QnaDocumentLibrary);

    public create = async (createModel: QnaDocumentLibraryCreateModel): Promise<QnaDocumentLibraryDto> => {
        const library = this._qnaDocumentLibraryRepository.create({
            DocumentVersionId : createModel.DocumentVersionId
        });
        var record = await this._qnaDocumentLibraryRepository.save(library);
        return QnaDocumentLibraryMapper.toResponseDto(record);
    };

    public update = async (id: uuid, model: QnaDocumentLibraryUpdateModel): Promise<QnaDocumentLibraryDto> => {
        try {
            const documentlibrary = await this._qnaDocumentLibraryRepository.findOne({
                where : {
                    id : id,
                },
               
            });
            if (!documentlibrary) {
                ErrorHandler.throwNotFoundError('Document library not found!');
            }

            if (model.DocumentVersionId != null) {
                documentlibrary.DocumentVersionId = model.DocumentVersionId;
            }

            var record = await this._qnaDocumentLibraryRepository.save(documentlibrary);
            return QnaDocumentLibraryMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: uuid): Promise<QnaDocumentLibraryDto> => {
        try {
            var documentlibrary = await this._qnaDocumentLibraryRepository.findOne({
                where : {
                    id : id,
                },
            });
            return QnaDocumentLibraryMapper.toResponseDto(documentlibrary);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var result = await this._qnaDocumentLibraryRepository.softDelete(id);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: QnaDocumentLibrarySearchFilters): Promise<QnaDocumentLibrarySearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._qnaDocumentLibraryRepository.findAndCount(search);

            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map((x) => QnaDocumentLibraryMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    private getSearchModel = (filters: QnaDocumentLibrarySearchFilters) => {
        var search: FindManyOptions<QnaDocumentLibrary> = {
            where : {},
        };

        if (filters.DocumentVersionId) {
            search.where['DocumentVersionId'] = filters.DocumentVersionId;
            search.where['DeletedAt'] = null;
            return search;
        }
    };

}
