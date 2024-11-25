import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { ChunkingStrategy } from '../../../domain.types/chunking.strategy.domain.types';
import { QnaDocumentVersion } from './qna.document.version.model';
import { FileResource } from '../file.resource/file.resource.model';

@Entity({ name: 'qna_documents' })
export class QnaDocument extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name: string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    Description: string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    Keyword: string;

    @Column({ default: true })
    IsActive: boolean;

    @Column({ type: 'varchar', length: 256, nullable: false })
    DocumentType: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    ParentDocumentResourceId: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    CreatedByUserId: string;

    @Column({ type: 'enum', enum: ChunkingStrategy, nullable: false })
    ChunkingStrategy: string;

    @Column({ nullable: false })
    ChunkingLength: number;

    @Column({ nullable: false })
    ChunkOverlap: number;

    @Column({ nullable: false })
    Splitter: string;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;

    @OneToMany(() => QnaDocumentVersion, (qnaDocumentVersion) => qnaDocumentVersion.QnaDocument, { cascade: true })
    QnaDocumentVersions: QnaDocumentVersion[];
    // @OneToMany(() => QnaDocumentVersion, (qna_Document_Versions) => qna_Document_Versions.Qna_Documents)
    // Qna_Document_versions: QnaDocumentVersion[];

    // @ManyToMany(() => QnaDocumentGroup, (qnaDocumentGroup) => qnaDocumentGroup.QnaDocuments)
    // @JoinTable()
    // QnaDocumentGroups: QnaDocumentGroup[];

    // @OneToOne(() => FileResource)
    @OneToOne(() => FileResource, (fileResource) => fileResource.QnaDocument) // specify inverse side as a second parameter
    @JoinColumn({ name: 'ResourceId' })
    FileResource: FileResource;

    // @OneToOne(() => FileResource, (fileResource) => fileResource.qna_document) // specify inverse side as a second parameter
    // @JoinColumn()
    // ResourceId: FileResource;
    
}

// import {
//     Entity,
//     BaseEntity,
//     Column,
//     PrimaryGeneratedColumn,
//     CreateDateColumn,
//     UpdateDateColumn,
//     DeleteDateColumn,
//     OneToMany,
//     ManyToMany,
//     JoinTable,
//     OneToOne,
//     JoinColumn,
// } from 'typeorm';
// import { ChunkingStrategy } from '../../../domain.types/chunking.strategy.domain.types';
// import { QnaDocumentVersion } from './qna.document.version.model';
// import { QnaDocumentGroup } from './qna.document.groups.model';
// import { FileResource } from '../file.resource/file.resource.model';

// @Entity({ name: 'qna_document' })
// export class QnaDocument extends BaseEntity {

//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @Column({ type: 'varchar', length: 256, nullable: false })
//     Name: string;

//     @Column({ type: 'varchar', length: 256, nullable: false })
//     Description: string;

//     @Column({ type: 'varchar', length: 256, nullable: false })
//     FileName: string;

//     @Column({ type: 'varchar', length: 256, nullable: false })
//     Source: string;

//     @Column({ type: 'varchar', length: 256, nullable: false })
//     CreatedBy: string;

//     @Column({ type: 'varchar', length: 256, nullable: true })
//     ParentDocument: string;

//     // @Column(({ type: 'varchar', length: 256, nullable: true }))
//     @Column()
//     ParentDocumentVersion: string;

//     @Column({ type: 'enum', enum: ChunkingStrategy })
//     ChunkingStrategy: string;

//     @Column()
//     ChunkingLength: number;

//     @Column()
//     ChunkOverlap: number;

//     @Column()
//     Splitter: string;

//     @Column()
//     IsActive: boolean;

//     @CreateDateColumn()
//     CreatedAt: Date;

//     @UpdateDateColumn()
//     UpdatedAt: Date;

//     @DeleteDateColumn()
//     DeletedAt: Date;

//     @OneToMany(() => QnaDocumentVersion, (qna_Document_Versions) => qna_Document_Versions.Qna_Documents)
//     Qna_Document_versions: QnaDocumentVersion[];

//     @ManyToMany(() => QnaDocumentGroup, (qnaDocumentGroup) => qnaDocumentGroup.QnaDocuments)
//     @JoinTable()
//     QnaDocumentGroups: QnaDocumentGroup[];

//     // @OneToOne(() => FileResource)
//     @OneToOne(() => FileResource, (fileResource) => fileResource.qna_document) // specify inverse side as a second parameter
//     @JoinColumn({ name: 'ResourceId' })
//     ResourceId: FileResource;

//     // @OneToOne(() => FileResource, (fileResource) => fileResource.qna_document) // specify inverse side as a second parameter
//     // @JoinColumn()
//     // ResourceId: FileResource;
    
// }
