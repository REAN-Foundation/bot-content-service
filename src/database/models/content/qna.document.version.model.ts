import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    OneToOne,
    
} from 'typeorm';
import { QnaDocument } from './qna.document.model';
import { FileResource } from '../file.resource/file.resource.model';
import { ChunkingStrategy } from '../../../domain.types/chunking.strategy.domain.types';
import { DocumentSource } from '../../../domain.types/content/qna.document.domain.types';
import { QnaDocumentLibrary } from './qna.document.library.model';

@Entity({ name: 'qna_document_versions' })
export class QnaDocumentVersion extends BaseEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    Version: number;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name: string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    Description: string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    Keyword: string;

    @Column({ default: true })
    IsActive: boolean;

    @Column({ type: 'varchar', length: 256, nullable: false })
    ResourceId: string;

    @Column({ type: "enum", enum: DocumentSource, default: "Custom" })
    DocumentSource: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    DocumentType: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    ParentDocumentResourceId: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    CreatedByUserId: string;

    @Column({ type: 'enum', enum: ChunkingStrategy })
    ChunkingStrategy: string;

    @Column()
    ChunkingLength: number;

    @Column()
    ChunkOverlap: number;

    @Column()
    Splitter: string;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;

    @ManyToOne(
        ()=>QnaDocument,
        qnaDocuments=> qnaDocuments.QnaDocumentVersions,
        { onDelete: 'CASCADE' })
    QnaDocument: QnaDocument;

    // @OneToMany(() => QnaDocumentVersion, (qna_Document_Versions) => qna_Document_Versions.Qna_Documents)
    // Qna_Document_versions: QnaDocumentVersion[];

    // @ManyToMany(() => QnaDocumentGroup, (qnaDocumentGroup) => qnaDocumentGroup.QnaDocuments)
    // @JoinTable()
    // QnaDocumentGroups: QnaDocumentGroup[];

    // @OneToOne(() => FileResource)
    // @OneToOne(() => FileResource, (fileResource) => fileResource.QnaDocument) // specify inverse side as a second parameter
    // FileResource: FileResource;

    // @OneToOne(() => QnaDocumentLibrary, (qnaDocumentLibrary) => qnaDocumentLibrary.QnaDocumentVersion) // specify inverse side as a second parameter
    // QnaDocumentLibrary: QnaDocumentLibrary;

}

// import {
//     Entity,
//     BaseEntity,
//     Column,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     UpdateDateColumn,
//     DeleteDateColumn,
//     ManyToOne,
//     JoinColumn,
    
// } from 'typeorm';
// import { QnaDocument } from './qna.document.model';

// @Entity({ name: 'qna_document_version' })
// export class QnaDocumentVersion extends BaseEntity {

//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @Column({ unique: true, nullable: false })
//     VersionNumber: string;

//     @Column({ type: 'varchar', length: 1024, nullable: true })
//     StorageUrl: string;

//     @Column({ type: 'varchar', length: 256, nullable: false })
//     DownloadUrl: string;

//     @Column({ type: 'varchar', length: 256, nullable: false })
//     FileResourceId: string;

//     @Column({ nullable: false })
//     Keywords: string;

//     @CreateDateColumn()
//     CreatedAt: Date;

//     @UpdateDateColumn()
//     UpdatedAt: Date;

//     @DeleteDateColumn()
//     DeletedAt: Date;

//     @ManyToOne(
//         ()=>QnaDocument,
//         Qna_Documents=> Qna_Documents.Qna_Document_versions,
//         { cascade: true , eager: true })
//     @JoinColumn({
//         name : 'QnaDocumentId'
//     })
//     Qna_Documents: QnaDocument;
    
// }
