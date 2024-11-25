import { Entity,BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { LlmPromptVersion } from "./llm.prompt.versions.model";
import { PromptUsecase } from "../../../domain.types/usecase.domain.types";
import { PromptGroup } from "../../../domain.types/promptgroup.domain.types";

@Entity('llm_prompts')
export class LlmPrompt extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column(({ type: 'varchar', length: 256, nullable: false }))
    Name: string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    Description: string;

    @Column({ type: "enum", enum: PromptUsecase })
    UseCaseType: string;

    @Column(({ type: "enum", enum: PromptGroup }))
    Group: string;

    @Column(({ type: 'varchar', length: 256, nullable: false }))
    Model: string;

    @Column(({ type: 'varchar', length: 5120, nullable: false }))
    Prompt : string;

    @Column(({ type: 'varchar', length: 2048, nullable: true }))
    Variables : string;

    @Column(({ nullable: false }))
    CreatedByUserId: string;

    @Column('decimal', { precision: 3, scale: 2 })
    Temperature: number;

    @Column('decimal', { precision: 3, scale: 2 })
    FrequencyPenalty: number;

    @Column('decimal', { precision: 3, scale: 2 })
    TopP: number;

    @Column('decimal', { precision: 3, scale: 2 })
    PresencePenalty: number;

    @Column()
    IsActive: boolean;

    @CreateDateColumn()
    CreatedAt: Date;

    @UpdateDateColumn()
    UpdatedAt: Date;

    @DeleteDateColumn()
    DeletedAt: Date;

    // @OneToMany(() => LlmPromptVersion,
    //     llm_prompt_versions => llm_prompt_versions.LlmPrompts)
    //         llm_prompt_versions: LlmPromptVersion[];

    @OneToMany(() => LlmPromptVersion, (llmPromptVersion) => llmPromptVersion.LlmPrompt)
                
    LlmPromptVersions: LlmPromptVersion[];

}
