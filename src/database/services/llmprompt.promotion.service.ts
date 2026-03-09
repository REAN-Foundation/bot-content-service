import { Repository } from 'typeorm';
import AWS from 'aws-sdk';
import { Source } from '../database.connector';
import { logger } from '../../logger/logger';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { LlmPrompt } from '../models/llm.prompt/llm.prompts.model';
import { LlmPromptVersion } from '../models/llm.prompt/llm.prompt.versions.model';
import { LlmPromptMapper } from '../mappers/llm.prompt/llm.prompt.mapper';
import {
    LlmPromptExport,
    LlmPromptVersionExport,
    LlmPromptPromotionPayload,
    LlmPromptPromoteToRequestDto,
    LlmPromptPromotionResult,
    LlmPromptPromotionFromResponse,
} from '../../domain.types/llm.prompt/llm.prompt.promotion.domain.types';

///////////////////////////////////////////////////////////////////////////////

export class LlmPromptPromotionService {

    private _llmPromptRepository        : Repository<LlmPrompt>        = Source.getRepository(LlmPrompt);

    private _llmPromptVersionRepository : Repository<LlmPromptVersion> = Source.getRepository(LlmPromptVersion);

    private _lambda                     : AWS.Lambda;

    constructor() {
        AWS.config.update({
            region          : process.env.AWS_REGION,
            accessKeyId     : process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
        });
        this._lambda = new AWS.Lambda();
    }

    //#region promoteFrom

    public promoteFrom = async (
        promptId          : uuid,
        tenantId          : string,
        targetEnvironment : string
    ): Promise<LlmPromptPromotionFromResponse> => {
        try {
            const prompt = await this._llmPromptRepository.findOne({
                where     : { id: promptId },
                relations : { LlmPromptVersions: true },
            });

            if (!prompt) {
                ErrorHandler.throwNotFoundError(`LlmPrompt with id ${promptId} not found.`);
            }

            const versionsExport: LlmPromptVersionExport[] = (prompt.LlmPromptVersions ?? []).map((v) => ({
                Version          : v.Version,
                Name             : v.Name,
                Description      : v.Description,
                UseCaseType      : v.UseCaseType,
                Group            : v.Group,
                Model            : v.Model,
                Prompt           : v.Prompt,
                Variables        : v.Variables,
                CreatedByUserId  : v.CreatedByUserId,
                Score            : v.Score,
                Temperature      : v.Temperature,
                FrequencyPenalty : v.FrequencyPenalty,
                TopP             : v.TopP,
                PresencePenalty  : v.PresencePenalty,
                IsActive         : v.IsActive,
                PublishedAt      : v.PublishedAt,
            }));

            const promptExport: LlmPromptExport = {
                PromptCode       : prompt.PromptCode,
                Name             : prompt.Name,
                Description      : prompt.Description,
                UseCaseType      : prompt.UseCaseType,
                Group            : prompt.Group,
                Model            : prompt.Model,
                Prompt           : prompt.Prompt,
                Variables        : prompt.Variables,
                CreatedByUserId  : prompt.CreatedByUserId,
                Temperature      : prompt.Temperature,
                FrequencyPenalty : prompt.FrequencyPenalty,
                TopP             : prompt.TopP,
                PresencePenalty  : prompt.PresencePenalty,
                IsActive         : prompt.IsActive,
                TenantId         : tenantId,
                Versions         : versionsExport,
            };

            const promotionPayload: LlmPromptPromotionPayload = {
                TenantId          : tenantId,
                TargetEnvironment : targetEnvironment,
                LlmPrompt         : promptExport,
            };

            const functionArn = process.env.LAMBDA_PROMPT_PROMOTION_FUNCTION_ARN;
            if (!functionArn) {
                ErrorHandler.throwInternalServerError('Lambda promotion function ARN is not configured.');
            }

            const params: AWS.Lambda.InvocationRequest = {
                FunctionName   : functionArn,
                InvocationType : 'RequestResponse',
                LogType        : 'Tail',
                Payload        : JSON.stringify(promotionPayload),
            };

            const response        = await this._lambda.invoke(params).promise();
            const responsePayload = response.Payload ? JSON.parse(response.Payload.toString()) : null;

            if (responsePayload?.Status !== 'success') {
                logger.error(`Lambda invocation failed: ${responsePayload?.Message}`);
                ErrorHandler.throwInternalServerError(responsePayload?.Message ?? 'Lambda invocation failed');
            }

            logger.info(`Lambda invoked for LlmPrompt ${promptId} promotion to ${targetEnvironment}.`);

            return {
                PromptCode        : prompt.PromptCode,
                PromptName        : prompt.Name,
                TenantId          : tenantId,
                TargetEnvironment : targetEnvironment,
                InitiatedAt       : new Date(),
                VersionCount      : versionsExport.length,
                Message           : `LlmPrompt promotion to ${targetEnvironment} initiated successfully`,
            };
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    };

    //#endregion

    //#region promoteTo

    public promoteTo = async (model: LlmPromptPromoteToRequestDto): Promise<LlmPromptPromotionResult> => {
        try {
            const { TenantId, LlmPrompt: promptData } = model;

            if (!promptData || !promptData.PromptCode) {
                ErrorHandler.throwInputValidationError('Cannot promote LlmPrompt: Missing LlmPrompt data or PromptCode.');
            }

            logger.info(`Checking if LlmPrompt ${promptData.PromptCode} already exists...`);

            const existing = await this._llmPromptRepository.findOne({
                where     : { PromptCode: promptData.PromptCode },
                relations : { LlmPromptVersions: true },
            });

            if (existing) {
                logger.info(`LlmPrompt ${promptData.PromptCode} exists, syncing...`);
                return await this.syncPrompt(existing, promptData, TenantId);
            }

            logger.info(`LlmPrompt ${promptData.PromptCode} does not exist, creating...`);
            return await this.createPrompt(promptData, TenantId);
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    };

    //#endregion

    //#region Private helpers

    private createPrompt = async (
        promptData : LlmPromptExport,
        tenantId   : string
    ): Promise<LlmPromptPromotionResult> => {

        const prompt = this._llmPromptRepository.create({
            PromptCode       : promptData.PromptCode,
            Name             : promptData.Name,
            Description      : promptData.Description,
            UseCaseType      : promptData.UseCaseType,
            Group            : promptData.Group,
            Model            : promptData.Model,
            Prompt           : promptData.Prompt,
            Variables        : promptData.Variables,
            CreatedByUserId  : promptData.CreatedByUserId,
            Temperature      : promptData.Temperature,
            FrequencyPenalty : promptData.FrequencyPenalty,
            TopP             : promptData.TopP,
            PresencePenalty  : promptData.PresencePenalty,
            IsActive         : promptData.IsActive,
            TenantId         : tenantId,
        });

        const savedPrompt = await this._llmPromptRepository.save(prompt);

        await this.upsertVersions(savedPrompt.id, promptData.Versions);

        const result = await this._llmPromptRepository.findOne({
            where     : { id: savedPrompt.id },
            relations : { LlmPromptVersions: true },
        });

        logger.info(`LlmPrompt ${promptData.PromptCode} created successfully with id: ${savedPrompt.id}`);

        return {
            action    : 'created',
            llmPrompt : LlmPromptMapper.toResponseDto(result),
            message   : `LlmPrompt ${promptData.PromptCode} created successfully`,
        };
    };

    private syncPrompt = async (
        existing   : LlmPrompt,
        promptData : LlmPromptExport,
        tenantId   : string
    ): Promise<LlmPromptPromotionResult> => {

        existing.Name             = promptData.Name;
        existing.Description      = promptData.Description;
        existing.UseCaseType      = promptData.UseCaseType;
        existing.Group            = promptData.Group;
        existing.Model            = promptData.Model;
        existing.Prompt           = promptData.Prompt;
        existing.Variables        = promptData.Variables;
        existing.Temperature      = promptData.Temperature;
        existing.FrequencyPenalty = promptData.FrequencyPenalty;
        existing.TopP             = promptData.TopP;
        existing.PresencePenalty  = promptData.PresencePenalty;
        existing.IsActive         = promptData.IsActive;
        existing.TenantId         = tenantId;

        const savedPrompt = await this._llmPromptRepository.save(existing);

        await this.upsertVersions(savedPrompt.id, promptData.Versions);

        const result = await this._llmPromptRepository.findOne({
            where     : { id: savedPrompt.id },
            relations : { LlmPromptVersions: true },
        });

        logger.info(`LlmPrompt ${promptData.PromptCode} synced successfully`);

        return {
            action    : 'updated',
            llmPrompt : LlmPromptMapper.toResponseDto(result),
            message   : `LlmPrompt ${promptData.PromptCode} synced successfully`,
        };
    };

    private upsertVersions = async (
        promptId : string,
        versions : LlmPromptVersionExport[]
    ): Promise<void> => {
        if (!versions || versions.length === 0) {
            return;
        }

        for (const vData of versions) {
            const existing = await this._llmPromptVersionRepository.findOne({
                where : {
                    LlmPrompt : { id: promptId },
                    Version   : vData.Version,
                },
            });

            if (existing) {
                existing.Name             = vData.Name;
                existing.Description      = vData.Description;
                existing.UseCaseType      = vData.UseCaseType;
                existing.Group            = vData.Group;
                existing.Model            = vData.Model;
                existing.Prompt           = vData.Prompt;
                existing.Variables        = vData.Variables;
                existing.Score            = vData.Score;
                existing.Temperature      = vData.Temperature;
                existing.FrequencyPenalty = vData.FrequencyPenalty;
                existing.TopP             = vData.TopP;
                existing.PresencePenalty  = vData.PresencePenalty;
                existing.IsActive         = vData.IsActive;
                existing.PublishedAt      = vData.PublishedAt;
                await this._llmPromptVersionRepository.save(existing);
            } else {
                const newVersion = this._llmPromptVersionRepository.create({
                    Version          : vData.Version,
                    Name             : vData.Name,
                    Description      : vData.Description,
                    UseCaseType      : vData.UseCaseType,
                    Group            : vData.Group,
                    Model            : vData.Model,
                    Prompt           : vData.Prompt,
                    Variables        : vData.Variables,
                    CreatedByUserId  : vData.CreatedByUserId,
                    Score            : vData.Score,
                    Temperature      : vData.Temperature,
                    FrequencyPenalty : vData.FrequencyPenalty,
                    TopP             : vData.TopP,
                    PresencePenalty  : vData.PresencePenalty,
                    IsActive         : vData.IsActive,
                    PublishedAt      : vData.PublishedAt,
                    LlmPrompt        : { id: promptId } as LlmPrompt,
                });
                await this._llmPromptVersionRepository.save(newVersion);
            }
        }
    };

    //#endregion

}
