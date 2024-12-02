import { Entity,BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";

@Entity('llm_prompts_templates')
export class LlmPromptTemplates extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column(({ type: 'varchar', length: 256, nullable: false }))
    Name: string;

    @Column(({ type: 'varchar', length: 256, nullable: true }))
    Description: string;

    @Column(({ type: 'varchar', length: 1024, nullable: false}))
    Content: string;

    @Column(({ type: 'int', nullable: true }))
    Version: number;

    @Column(({ type: 'int', nullable: true }))
    TenantId: number;

    @Column(({ type: 'varchar', length: 256, nullable: true }))
    Type: string;

    @Column(({ type: 'varchar', length: 256, nullable: true }))
    Category: string;

    @Column(({ type: 'varchar', length: 256, nullable: true }))
    SubGroup: string;

    @Column()
    IsActive: boolean;

    @Column(({ nullable: false}))
    CreatedByUserId: string;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;
}
