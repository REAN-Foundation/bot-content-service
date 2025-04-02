import { LlmOutputSchema } from "../../domain.types/llm.prompt/llm.prompt.domain.types";

export class PromptTemplates {

    public static jsonSchema = () => {
        const jsonSchema: LlmOutputSchema = {
            answer           : "provide your answer here",
            intent           : "identify the intent of the user query",
            detectedLanguage : "detect the language and add the language code of the user query",
            sourceOfInfo     : "source frrom where the answer is generated and should only be one of the following, provided documents, internet, training data"
        };

        return jsonSchema;
    };

    public static introductionTemplate = () => {
        const introTemplate = `You are a chatbot that is an expert and only answers queries relevant to {introduction}.`;
        return introTemplate;
    };

    public static responseFormatTemplate = () => {

        const responseTemplate = `Response Format:
        Always return your answer in the following JSON format:

        {{${this.jsonSchema}}}
        `;
        return responseTemplate;
    };

    public static instructionTemplate = () => {
        const instructionTemplate = `
        STRICT INSTRUCTIONS TO FOLLOW:
        
        {instructions}`;
        return instructionTemplate;
    };

    public static guidelineTemplate = () => {
        const guidelinesTemplate = `Guidelines for the answers to follow are
        
        {guidelines}`;
        return guidelinesTemplate;
    };

    public static chatHistoryTemplate = () => {
        const chatHistoryTemplate = `
        Reference the chat history provided below enclosed in <chat_history></chat_history> to better understand the context of the conversation.
        DO NOT USE THE LANGUAGE IN THE CHAT HISTORY FOR THE LANGUAGE OF THE ANSWER GENERATED.

        <chat_history> {chat_history} </chat_history>
        `;
        return chatHistoryTemplate;
    };

    public static similarDocsTemplate = () => {
        const similarDocsTemplate = `
        These are the similar documents for your reference:
        
        <documents> {input_documents} </documents>`;
        return similarDocsTemplate;
    };

    public static userQueryTemplate = () => {
        const userQueryTemplate = `
        Here is the user query/question
        
        <user_query> {user_query} </user_query>
        `;
        return userQueryTemplate;
    };

    public static promptStructure = () => {
        const promptStructure = {
            "introduction"   : this.introductionTemplate(),
            "userQuery"      : this.userQueryTemplate(),
            "responseFormat" : this.responseFormatTemplate(),
            "instruction"    : this.instructionTemplate(),
            "guidelines"     : this.guidelineTemplate(),
            "chatHistory"    : this.chatHistoryTemplate(),
            "similarDocs"    : this.similarDocsTemplate(),
        };
        return promptStructure;
    };

}
