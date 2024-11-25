import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'llm_prompt_groups' })
export class LlmPromptGroup extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column(({ type: "varchar", length: 256, nullable: false, unique: true }))
    Name: string;

    @Column({ type: 'varchar', length: 1024, nullable: true })
    Description: string;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;
   
}
