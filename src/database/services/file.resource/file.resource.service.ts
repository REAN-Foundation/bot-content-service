import fs from 'fs';
import { FileResource } from '../../models/file.resource/file.resource.model';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import {
    FileResourceCreateModel,
    FileResourceResponseDto,
    FileResourceSearchFilters,
    FileResourceSearchResults
} from '../../../domain.types/general/file.resource.domain.types';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { FileResourceMapper } from '../../mappers/file.resource/file.resource.mapper';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { logger } from '../../../logger/logger';
import { FileResourceDto } from '../../../domain.types/general/file.resource/file.resource.dto';
import { FileResourceMetadata } from '../../../domain.types/general/file.resource/file.resource.types';
import path from 'path';
import { Helper } from '../../../common/helper';
import { FileResourceUploadDomainModel } from '../../../domain.types/general/file.resource/file.resource.domain.model';
// import { ConfigurationManager } from '../../../config/configuration.manager';
// import { TimeUtils } from '../../../common/utilities/time.utils';
import { StorageService } from '../../../modules/storage/storage.service';
// import { Loader } from '../../../startup/loader';
import { QnaDocument } from '../../models/content/qna.document.model';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////////////////

export class FileResourceService {

    //#region Models

    _storageService: StorageService = null;

    _fileResourceRepository : Repository<FileResource> = Source.getRepository(FileResource);

    _documentRepository : Repository<QnaDocument> = Source.getRepository(QnaDocument);

    constructor() {
        // this._storageService = new StorageService();
        this._storageService = Loader.Container.resolve(StorageService);
    }

    //#endregion

    //#region Publics

    create = async (createModel: FileResourceCreateModel): Promise<FileResourceResponseDto> => {
        try {
            var fileResource = new FileResource();
            // var uploadedBy = null;
            // if (createModel.DocumentId) {
            //     document = await this._documentRepository.findOne({
            //         where : {
            //             id : createModel.DocumentId
            //         }
            //     });
            // }

            fileResource.OriginalFilename = createModel.OriginalFilename;
            fileResource.MimeType         = createModel.MimeType;
            fileResource.Public           = createModel.Public;
            fileResource.Size             = createModel.Size;
            fileResource.StorageKey       = createModel.StorageKey;
            fileResource.Tags             = createModel.Tags;
            // fileResource.DocumentId       = document;

            var record = await this._fileResourceRepository.save(fileResource);
            return FileResourceMapper.toResponseDto(record);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to create file resource!', error);
        }
    };

    getById = async (id: uuid): Promise<FileResourceResponseDto> => {
        try {
            const record = await this._fileResourceRepository.findOne({
                where : {
                    id : id
                },

                /*relations : {
                    UploadedBy : true
                },*/
                select : {
                    id               : true,
                    OriginalFilename : true,
                    CreatedAt        : true,
                    UpdatedAt        : true,
                    DownloadCount    : true,
                    MimeType         : true,
                    Public           : true,
                    Size             : true,
                    StorageKey       : true,
                    Tags             : true,

                    /*UploadedBy       : {
                        id     : true,
                        Client : {
                            Name : true
                        },
                        FirstName : true,
                        LastName  : true,
                        Prefix    : true
                    },*/
                },
            });
            return FileResourceMapper.toResponseDto(record);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to retrieve file resource!', error);
        }
    };

    incrementDownloadCount = async (id: uuid): Promise<boolean> => {
        try {
            var record =  await this._fileResourceRepository.findOne({
                where : {
                    id : id
                }
            });
            record.DownloadCount = record.DownloadCount + 1;
            await this._fileResourceRepository.save(record);
            return true;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update download count for file resource!', error);
        }
    };

    exists = async (id: uuid): Promise<boolean> => {
        try {
            var record =  await this._fileResourceRepository.findOne({
                where : {
                    id : id
                }
            });
            return record !== null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to determine existance of file resource!', error);
        }
    };

    search = async (filters: FileResourceSearchFilters): Promise<any> => {
        try {

            var search : FindManyOptions<FileResource> = {
                relations : {
                },
                where : {
                },
                select : {
                    id               : true,
                    OriginalFilename : true,
                    CreatedAt        : true,
                    UpdatedAt        : true,
                    DownloadCount    : true,
                    MimeType         : true,
                    Public           : true,
                    Size             : true,
                    StorageKey       : true,
                    Tags             : true,
                    // UploadedBy       : {
                    //     id     : true,
                    //     Client : {
                    //         Name : true
                    //     },
                    //     FirstName : true,
                    //     LastName  : true,
                    //     Prefix    : true
                    // },
                }
            };
            // if (filters.UserId) {
            //     search.relations['UploadedBy'] = true;
            //     search.where['UploadedBy'] = {
            //         id : filters.UserId
            //     };
            // }
            if (filters.Filename) {
                search.where['OriginalFilename'] =  Like(`%${filters.Filename}%`);
            }
            if (filters.Tags) {
                search.where['Tags'] =  Like(`%${filters.Tags}%`);
            }

            //Sorting
            let orderByColumn = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColumn = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = {};
            search['order'][orderByColumn] = order;

            //Pagination
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

            const [list, count] = await this._fileResourceRepository.findAndCount(search);
            const searchResults: FileResourceSearchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => FileResourceMapper.toResponseDto(x)),
            };

            return searchResults;

        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    update = async (id: uuid, updateModel) => {
        try {
            if (Object.keys(updateModel).length > 0) {
                var res = await this._fileResourceRepository.update({
                    id : id
                }, updateModel);
                logger.info(`Update SQL Query : ${res.raw}`);
            }
            return await this.getById(id);
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to update file resource!', error);
        }
    };

    delete = async (id: uuid) => {
        try {
            var record = await this._fileResourceRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!record) {
                return false; // Record not found
            }
            record.DeletedAt = new Date(); // Soft delete
            await this._fileResourceRepository.save(record);
            return true; // Soft delete successful
            // var result = await this._fileResourceRepository.remove(record);
            // return result != null;
        } catch (error) {
            ErrorHandler.throwDbAccessError('DB Error: Unable to delete file resource!', error);
        }
    };

    uploadLocal = async (
        storageKey: string,
        sourceLocation: string,
        isPublicResource: boolean
    ): Promise<FileResourceDto> => {

        var exists = fs.existsSync(sourceLocation);
        if (!exists) {
            console.log('Source file location does not exist!');
        }

        var existingStorageKey = await this._storageService.exists(storageKey);
        if (existingStorageKey !== undefined && existingStorageKey !== null) {
            storageKey = existingStorageKey;
        }
        else {
            // storageKey = await this._storageService.uploadLocally(storageKey, sourceLocation);
        }

        if (!storageKey) {
            console.log('Unable to upload file to storage!');
            return null;
        }
        
        var stats = fs.statSync(sourceLocation);
        var filename = path.basename(sourceLocation);

        var metadata: FileResourceMetadata = {
            Version        : '1',
            OriginalName   : filename,
            FileName       : filename,
            SourceFilePath : null,
            MimeType       : Helper.getMimeType(sourceLocation),
            Size           : stats['size'] / 1024,
            StorageKey     : storageKey,
        };

        var domainModel: FileResourceUploadDomainModel = {
            FileMetadata           : metadata,
            StorageKey             : metadata.StorageKey,
            FileName               : metadata.FileName,
            IsMultiResolutionImage : false,
            MimeType               : Helper.getMimeType(sourceLocation),
            Public                 : isPublicResource,
        };

        var resource = await this._fileResourceRepository.create(domainModel);
        var record = await this._fileResourceRepository.save(resource);

        domainModel.FileMetadata.ResourceId = record.id;
        // var version = await this.addVersion(domainModel.FileMetadata, true);
        // resource.DefaultVersion = version;
        // resource.Url = version.Url;
        
        return resource;
    };

    // eslint-disable-next-line max-len
    // addVersion = async (metadata: FileResourceMetadata, makeDefaultVersion: boolean): Promise<FileResourceMetadata> => {

    //     var fileVersion = {
    //         ResourceId       : metadata.ResourceId,
    //         Version          : metadata.Version,
    //         FileName         : metadata.FileName,
    //         OriginalFileName : metadata.OriginalName,
    //         MimeType         : metadata.MimeType,
    //         StorageKey       : metadata.StorageKey,
    //         SizeInKB         : metadata.Size,
    //     };

    //     // var record = await this._fileResourceVersionRepository.create(fileVersion);
    //     // var version = await this._fileResourceVersionRepository.save(record);

    //     // if (version === null) {
    //     //     throw new Error('Unable to create version instance in database!');
    //     // }

    //     if (makeDefaultVersion) {
    //         var resource = await this._fileResourceRepository.findOne({
    //             where : {
    //                 id : metadata.ResourceId
    //             }
    //         });
    //         if (resource === null) {
    //             throw new Error('Unable to find resource!');
    //         }
    //         // resource.DefaultVersionId = version.id;
    //         //await resource.save();
    //     }

    //     return FileResourceMapper.toFileVersionDto(version);
    // };

    // DownloadByVersion = async (resourceId: string, versionName: string): Promise<string> => {
    //     var downloadFolderPath = await this.generateDownloadFolderPath();
    //     //var versionMetadata = await this._fileResourceRepo.getVersionByVersionName(resourceId, versionName);

    //     var versionMetadata = await this._fileResourceVersionRepository.findOne({
    //         where : {
    //             ResourceId : resourceId,
    //         }
    //     });
    //     // const versionMetadata_ = FileResourceMapper.toFileVersionDto(versionMetadata);
    //     var localFilePath = path.join(downloadFolderPath, versionMetadata.FileName);
    //     var localDestination = await this._storageService.download(versionMetadata.StorageKey, localFilePath);
    //     return localDestination;
    // };

    // private generateDownloadFolderPath = async() => {

    //     var timestamp = TimeUtils.timestamp(new Date());
    //     var tempDownloadFolder = ConfigurationManager.DownloadTemporaryFolder;
    //     var downloadFolderPath = path.join(tempDownloadFolder, timestamp);

    //     //Make sure the path exists
    //     await fs.promises.mkdir(downloadFolderPath, { recursive: true });

    //     return downloadFolderPath;
    // };

    //#endregion

}
