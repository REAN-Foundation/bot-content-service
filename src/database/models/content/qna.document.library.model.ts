import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { QnaDocumentVersion } from './qna.document.version.model';

@Entity({ name: 'qna_document_libraries' })
export class QnaDocumentLibrary extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    DocumentVersionId: string;
    // @OneToOne(() => QnaDocumentVersion, (QnaDocumentVersion) => QnaDocumentVersion.QnaDocumentLibrary) // specify inverse side as a second parameter
    // QnaDocumentVersion: QnaDocumentVersion;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;
    
}
