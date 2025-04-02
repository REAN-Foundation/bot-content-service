import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { Entity,BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { LlmPrompt } from "./llm.prompts.model";
import { PromptUsecase } from "../../../domain.types/usecase.domain.types";

@Entity('llm_prompt_versions')
export class LlmPromptVersion extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id: uuid;
    
    @Column(({ nullable: false }))
    Version: number;
    
    @Column(({ type: 'varchar', length: 256, nullable: false }))
    Name: string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    Description: string;

    @Column({ type: "enum", enum: PromptUsecase })
    UseCaseType: string;

    @Column(({ type: "varchar", length: 1024, nullable: false }))
    Group: string;

    @Column(({ type: 'varchar', length: 256, nullable: false }))
    Model: string;

    @Column({ type: 'varchar', length: 5120, nullable: false })
    Prompt: string;

    @Column(({ type: 'varchar', length: 2048,  nullable: true }))
    Variables: string;

    @Column(({ nullable: false }))
    CreatedByUserId: string;

    @Column('decimal', { precision: 3, scale: 2 })
    Score: number;

    @Column('decimal', { precision: 3, scale: 2 })
    Temperature: number;

    @Column('decimal', { precision: 3, scale: 2 })
    FrequencyPenalty: number;

    @Column('decimal', { precision: 3, scale: 2 })
    TopP: number;

    @Column()
    IsActive: boolean;
    
    @Column('decimal', { precision: 3, scale: 2 })
    PresencePenalty: number;

    @Column({ type: 'date', nullable: true })
    PublishedAt: Date;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;

    // @ManyToOne(() => LlmPrompt, (llmPrompt) => llmPrompt.LlmPromptVersions, { eager: true, nullable: true })
    // @JoinColumn()
    // LlmPrompts: LlmPrompt;

    @ManyToOne(() => LlmPrompt, (llmPrompt) => llmPrompt.LlmPromptVersions, { eager: true, nullable: true })
    LlmPrompt: LlmPrompt;

}
