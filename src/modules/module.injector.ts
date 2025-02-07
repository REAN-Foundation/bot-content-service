import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
// import { CommunicationInjector } from './communication/communication.injector';
// import { EhrInjector } from './ehr/ehr.injector';
import { FileStorageInjector } from './storage/file.storage.injector';
import { VectorstoreInjector, KeywordInjector } from './vectorstores/vectorstores.injector';

////////////////////////////////////////////////////////////////////////////////

export class ModuleInjector {

    static registerInjections(container: DependencyContainer) {

        // EhrInjector.registerInjections(container);
        // CommunicationInjector.registerInjections(container);
        FileStorageInjector.registerInjections(container);
        VectorstoreInjector.registerInjections(container);
        KeywordInjector.registerInjection(container);

    }

}
