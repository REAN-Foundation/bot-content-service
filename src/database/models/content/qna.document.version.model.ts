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
} from 'typeorm';
import { QnaDocument } from './qna.document.model';

@Entity({ name: 'qna_document_version' })
export class QnaDocumentVersion extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    VersionNumber: string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    StorageUrl: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    DownloadUrl: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    FileResourceId: string;

    @Column({ nullable: false })
    Keywords: string;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;

    @ManyToOne(
        ()=>QnaDocument,
        Qna_Documents=> Qna_Documents.Qna_Document_versions
    )
    @JoinColumn({
        name : 'QnaDocumentId'
    })
    Qna_Documents: QnaDocument;
    
}
