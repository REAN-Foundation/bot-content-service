//////////////////////////////////////////
import { decimal, uuid } from "../miscellaneous/system.types";

export enum VectorStoreDatabaseType {
    FAISS = "faiss",
    MILVUS = "milvus",
    PGVECTOR = "pgvector",
    PINECONE = "pinecone"
}

export interface VectorStoreCreateModel {
    id: string;
    TenantId: string;
    Version: decimal;
}

export interface VectorStoreSearchModel {
    TenantId: string;
    Query: string;
}


export interface TextSplitterConfig {
    chunkSize?: number;
    chunkOverlap?: number;
}
