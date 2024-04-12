// import fs from "fs";
// import path from "path";
import { logger } from "../logger/logger";
// import * as RolePrivilegesList from '../../seed.data/role.privileges.json';
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
// import { BadgeService } from "../database/services/awards/badge.service";
// import { BadgeUpdateModel } from "../domain.types/awards/badge.domain.types";

//////////////////////////////////////////////////////////////////////////////

export class Seeder {

    _fileResourceService: FileResourceService = null;

    constructor () {

        this._fileResourceService = Loader.Container.resolve(FileResourceService);

    }

    public seed = async (): Promise<void> => {
        try {
            await this.createTempFolders();
         
        } catch (error) {
            logger.error(error.message);
        }
    };

    private createTempFolders = async () => {
        await FileUtils.createTempDownloadFolder();
        await FileUtils.createTempUploadFolder();
    };

}
