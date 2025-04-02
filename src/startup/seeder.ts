// import fs from "fs";
// import path from "path";
import { logger } from "../logger/logger";
import PromptGroupList from '../../seed.data/default.prompt.group.json';
import DocumentGroupList from '../../seed.data/default.document.group.json';
// import * as seedHowToEarnBadgeContent from '../../seed.data/how.to.earn.badge.content.seed..json';
// import { UserService } from '../database/services/user/user.service';
// import { UserCreateModel } from "../domain.types/user/user.domain.types";
// import { Gender } from "../domain.types/miscellaneous/system.types";
// import { RoleService } from "../database/services/user/role.service";
import { FileResourceService } from "../database/services/file.resource/file.resource.service";
// import { PrivilegeService } from "../database/services/user/privilege.service";
// import { RoleCreateModel } from "../domain.types/user/role.domain.types";
// import { ClientResponseDto } from "../domain.types/client/client.domain.types";
import { FileUtils } from "../common/utilities/file.utils";
// import { StringUtils } from "../common/utilities/string.utils";
// import { BadgeStockImageDomainModel } from "../domain.types/badge.stock.image/badge.stock.image.domain.model";
// import { BadgeStockImageService } from "../database/services/badge.stock.images/badge.stock.image.service";
// import { ClientService } from "../database/services/client/client.service";
import { Loader } from "./loader";
import { LlmpromptGroupService } from "../database/services/llmprompt.group.service";
import { QnaDocumentGroupService } from "../database/services/content/qna.document.group.service";
// import { BadgeService } from "../database/services/awards/badge.service";
// import { BadgeUpdateModel } from "../domain.types/awards/badge.domain.types";

//////////////////////////////////////////////////////////////////////////////

export class Seeder {

    _llmPromptGroupService: LlmpromptGroupService = new LlmpromptGroupService();

    _qnaDocumentGroupService: QnaDocumentGroupService = new QnaDocumentGroupService();

    // _userService: UserService = new UserService();

    // _roleService: RoleService = new RoleService();

    // _privilegeService: PrivilegeService = new PrivilegeService();

    _fileResourceService: FileResourceService = null;

    constructor () {

        this._fileResourceService = Loader.Container.resolve(FileResourceService);

    }

    public seed = async (): Promise<void> => {
        try {
            await this.createTempFolders();
            await this.seedPromptDefaultGroup();
            await this.seedDocumentDefaultGroup();
            // await this.seedDefaultRoles();
            // const clients = await this.seedInternalClients();
            // await this.seedRolePrivileges();
            // await this.seedDefaultUsers(clients);
            // await this.seedBadgeStockImages();
            // await this.seedHowToEarnBadgeContent();
        } catch (error) {
            logger.error(error.message);
        }
    };

    private createTempFolders = async () => {
        await FileUtils.createTempDownloadFolder();
        await FileUtils.createTempUploadFolder();
    };

    private seedPromptDefaultGroup = async () => {
        try {
            const array = PromptGroupList.default;
            const availablePromptGroups = [];

            const promptGroupSearchResult = await this._llmPromptGroupService.search({});

            if (promptGroupSearchResult.TotalCount) {
                promptGroupSearchResult.Items.forEach(item => availablePromptGroups.push(item.Name));
            }

            for (let i = 0; i < array.length; i++) {
                const promptGroupName = array[i];
                if (availablePromptGroups.includes(promptGroupName)) {
                    continue;
                }
                await this._llmPromptGroupService.create({
                    Name : promptGroupName
                });
                availablePromptGroups.push(promptGroupName);
            }
            logger.info('Seeded llm prompt groups successfully!');
        } catch (error) {
            logger.info('Error occurred while seeding llm prompt default groups!');
        }
    };

    private seedDocumentDefaultGroup = async () => {
        try {
            const array = DocumentGroupList.default;
            const availableDocumentGroups = [];

            const documentGroupSearchResult = await this._qnaDocumentGroupService.search({});

            if (documentGroupSearchResult.TotalCount) {
                documentGroupSearchResult.Items.forEach(item => availableDocumentGroups.push(item.Name));
            }

            for (let i = 0; i < array.length; i++) {
                const documentGroupName = array[i];
                if (availableDocumentGroups.includes(documentGroupName)) {
                    continue;
                }
                await this._qnaDocumentGroupService.create({
                    Name : documentGroupName
                });
                availableDocumentGroups.push(documentGroupName);
            }
            logger.info('Seeded qna document groups successfully!');
        } catch (error) {
            logger.info('Error occurred while seeding qna document default groups!');
        }
    };

    // private seedDefaultUsers = async (clients: ClientResponseDto[]) => {

    //     var internalClient: ClientResponseDto = null;
    //     if (clients && clients.length > 0)
    //     {
    //         internalClient = clients[0];
    //     }

    //     const defaultUsers = this.loadJSONSeedFile('default.users.seed.json');

    //     for await (var u of defaultUsers) {

    //         const role = await this._roleService.getByRoleName(u.Role);

    //         const existingUser = await this._userService.getUser(null, null, null, u.UserName);
    //         if (existingUser) {
    //             continue;
    //         }

    //         const createModel : UserCreateModel = {
    //             ClientId    : internalClient ? internalClient.id : null,
    //             Phone       : u.Phone,
    //             FirstName   : u.FirstName,
    //             LastName    : u.LastName,
    //             UserName    : u.UserName,
    //             Password    : u.Password,
    //             RoleId      : role.id,
    //             CountryCode : u.CountryCode,
    //             Email       : u.Email,
    //             Gender      : Gender.Male,
    //             BirthDate   : null,
    //             Prefix      : ""
    //         };

    //         createModel.Password = StringUtils.generateHashedPassword(u.Password);
    //         const user = await this._userService.create(createModel);
    //         logger.info(JSON.stringify(user, null, 2));
    //     }

    //     logger.info('Seeded default users successfully!');
    // };

    // private loadJSONSeedFile(file: string): any {
    //     var filepath = path.join(process.cwd(), 'seed.data', file);
    //     var fileBuffer = fs.readFileSync(filepath, 'utf8');
    //     const obj = JSON.parse(fileBuffer);
    //     return obj;
    // }

    // private seedInternalClients = async () => {

    //     logger.info('Seeding internal clients...');

    //     const clients: ClientResponseDto[] = [];

    //     const arr = this.loadJSONSeedFile('internal.clients.seed.json');

    //     for (let i = 0; i < arr.length; i++) {
    //         var c = arr[i];
    //         let client = await this._clientService.getByClientCode(c.Code);
    //         if (client == null) {
    //             const model = {
    //                 Name         : c['Name'],
    //                 Code         : c['Code'],
    //                 IsPrivileged : c['IsPrivileged'],
    //                 CountryCode  : '+91',
    //                 Phone        : '1000000000',
    //                 Email        : c['Email'],
    //                 Password     : c['Password'],
    //                 ValidFrom    : new Date(),
    //                 ValidTill    : new Date(2030, 12, 31),
    //                 ApiKey       : c['ApiKey'],
    //             };
    //             client = await this._clientService.create(model);
    //             logger.info(JSON.stringify(client, null, 2));
    //         }
    //         clients.push(client);
    //     }
    //     return clients;

    // };

    // private seedDefaultRoles = async () => {

    //     const defaultRoles = [
    //         {
    //             Name        : 'Admin',
    //             Description : 'Administrator of the Awards service'
    //         },
    //         {
    //             Name        : 'ContentModerator',
    //             Description : 'The content moderator representing a particular client.'
    //         }
    //     ];

    //     for await (var role of defaultRoles) {
    //         var existing = await this._roleService.getByRoleName(role.Name);
    //         if (!existing) {
    //             const model: RoleCreateModel = {
    //                 ...role
    //             };
    //             await this._roleService.create(model);
    //         }
    //     }

    //     logger.info('Seeded default roles successfully!');
    // };

    // private seedBadgeStockImages = async () => {

    //     var images = await this._badgeStockImageService.getAll();
    //     if (images.length > 0) {
    //         return;
    //     }

    //     var destinationStoragePath = 'assets/images/stock.badge.images/';
    //     var sourceFilePath = path.join(process.cwd(), "./assets/images/stock.badge.images/");

    //     var files = fs.readdirSync(sourceFilePath);
    //     var imageFiles = files.filter((f) => {
    //         return path.extname(f).toLowerCase() === '.png';
    //     });

    //     for await (const fileName of imageFiles) {

    //         var sourceLocation = path.join(sourceFilePath, fileName);
    //         var storageKey = destinationStoragePath + fileName;

    //         var uploaded = await this._fileResourceService.uploadLocal(
    //             storageKey,
    //             sourceLocation,
    //             true);
            
    //         if (!uploaded) {
    //             continue;
    //         }

    //         var domainModel: BadgeStockImageDomainModel = {
    //             Code       : fileName.replace('.png', ''),
    //             FileName   : fileName,
    //             ResourceId : uploaded.id,
    //             PublicUrl  : uploaded.DefaultVersion.Url
    //         };

    //         var badgeStockImage = await this._badgeStockImageService.create(domainModel);
    //         if (!badgeStockImage) {
    //             logger.info('Error occurred while seeding badge stock images!');
    //         }
    //     }
    // };

    // public seedHowToEarnBadgeContent = async () => {

    //     logger.info('Seeding how to earn content for badges...');

    //     const arr = seedHowToEarnBadgeContent['default'];
    //     //console.log(JSON.stringify(arr, null, 2));

    //     for (let i = 0; i < arr.length; i++) {

    //         const filters = {
    //             Name : arr[i]['Name']
    //         };

    //         const existingRecord = await this._badgeService.search(filters);
    //         //console.log(JSON.stringify(existingRecord, null, 2));
            
    //         if (existingRecord.Items.length > 0) {

    //             const entity = existingRecord.Items[0];
    //             const model: BadgeUpdateModel = {
    //                 HowToEarn       : arr[i]['HowToEarn'],
    //                 ClientId        : entity.Client.id,
    //                 CategoryId      : entity.Category.id
    //             };
    
    //             var record = await this._badgeService.update(entity.id, model);
    //             var str = JSON.stringify(record, null, '  ');
    //             logger.info(str);
    //         }

    //     }
    // };
}
