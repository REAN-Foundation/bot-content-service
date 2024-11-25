import 'reflect-metadata';
import { ConfigurationManager } from '../../config/configuration.manager';
import { DependencyContainer } from 'tsyringe';
import { PineconeVectorStore } from './providers/pinecone.vectorstore.service';
import { FaissVectorStore } from './providers/faiss.vectorstore.service';

////////////////////////////////////////////////////////////////////////////////

export class VectorstoreInjector {

    static registerInjections(container: DependencyContainer) {

        const provider = ConfigurationManager.VectorstoreProvider;
        if (provider === 'PINECONE') {
            container.register('IVectorstoreService', PineconeVectorStore);
        }
        else if (provider === 'FAISS') {
            container.register('IVectorstoreService', FaissVectorStore);
        }
    }
}
