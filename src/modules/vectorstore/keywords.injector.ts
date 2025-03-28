import 'reflect-metadata';
import { ConfigurationManager } from '../../config/configuration.manager';
import { DependencyContainer } from 'tsyringe';
import { PgKeywordsService } from './providers/pgvector.keywords.service';

export class KeywordsInjector {
    
    static registerInjection(container: DependencyContainer) {
        const provider = ConfigurationManager.VectorstoreProvider;
        if (provider === 'PGVECTOR') {
            container.register('IKeywordsService', PgKeywordsService);
        }
    }
}