import { PromptTemplates } from "./prompt.templates";
// import { getCache } from "./cache";
import { PromptTemplate, PipelinePromptTemplate } from '@langchain/core/prompts';
import { ValidationError } from "class-validator";
import { PromptInputVariables } from "./interface/prompt.input.variables";

export class PromptManager {

    private clientVariables: PromptInputVariables;

    private promptStructure;
  
    constructor(client: string) {
        try {
            // const configuration = getCache(client);
            // this.clientVariables = this.validateClientVariables(configuration);
            this.promptStructure = PromptTemplates.promptStructure();
        } catch (error) {
            console.error("Error initializing PromptManager:", error);
            throw new Error("Failed to initialize PromptManager");
        }
    }
  
    private validateClientVariables(data: any): PromptInputVariables {
        // Here, you'd use class-validator or similar to validate the incoming data
        if (!data.introduction || !data.instructions || !data.guidelines) {
            throw new Error("Invalid client variables");
        }
        return data as PromptInputVariables;
    }
  
    public getPrompt(history: string[], userQuery: string){
        try {
            const promptMap: Record<string, PromptTemplate> = {};
            const finalPromptsList: [string, PromptTemplate][] = [];
            let fullPromptTemplate = "";
  
            for (const key of Object.keys(this.promptStructure)) {
                const promptTemplate = new PromptTemplate(this.promptStructure[key]);
                promptMap[`${key}_prompt`] = promptTemplate;
                finalPromptsList.push([key.toLowerCase(), promptTemplate]);
                fullPromptTemplate += `{${key.toLowerCase()}} \n\n`;
            }
            
            console.log(finalPromptsList);
            // const fullPrompt = PromptTemplate.fromTemplate(fullPromptTemplate);
            // const pipelinePrompt = new PipelinePromptTemplate({
            //     finalPrompt     : fullPrompt,
            //     pipelinePrompts : finalPromptsList,
            // });
  
            // return pipelinePrompt;
        } catch (error) {
            console.error("Unable to create the prompt:", error);
            return undefined;
        }
    }
  
    // public getInputVariables(data: LlmDataObject): string | undefined {
    //     try {
    //         const inputVariables: PromptInputVariables = {
    //             inputDocuments : data.similaritySearchDocs,
    //             userQuery      : data.userQuery,
    //             chatHistory    : data.history,
    //             introduction   : this.clientVariables.introduction,
    //             instructions   : this.clientVariables.instructions,
    //             guidelines     : this.clientVariables.guidelines,
    //         };
  
    //         return JSON.stringify(inputVariables);
    //     } catch (error) {
    //         console.error("Error getting input variables:", error);
    //         return undefined;
    //     }
    // }
}
  