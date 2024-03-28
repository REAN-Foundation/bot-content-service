import {
    Entity,
    BaseEntity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { ChunkingStrategy } from '../../../domain.types/chunking.strategy.domain.types';
import { QnaDocumentVersion } from './qna.document.version.model';
import { QnaDocumentGroup } from './qna.document.groups.model';

@Entity({ name: 'qna_document' })
export class QnaDocument extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Name: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Description: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    FileName: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    Source: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    CreatedBy: string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    ParentDocument: string;

    // @Column(({ type: 'varchar', length: 256, nullable: true }))
    @Column()
    ParentDocumentVersion: string;

    @Column({ type: 'enum', enum: ChunkingStrategy })
    ChunkingStrategy: string;

    @Column()
    ChunkingLength: number;

    @Column()
    ChunkOverlap: number;

    @Column()
    Splitter: string;

    @Column()
    IsActive: boolean;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;

    @OneToMany(() => QnaDocumentVersion, (qna_Document_Versions) => qna_Document_Versions.Qna_Documents)
    Qna_Document_versions: QnaDocumentVersion[];

    @ManyToMany(() => QnaDocumentGroup, (qnaDocumentGroup) => qnaDocumentGroup.QnaDocuments)
    @JoinTable()
    QnaDocumentGroups: QnaDocumentGroup[];

}
