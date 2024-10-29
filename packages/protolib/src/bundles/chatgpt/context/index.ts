import { getLogger } from "protobase";
import { getServiceToken } from '../../apis/context';
import { getKey } from "../../keys/context";
import OpenAI from 'openai';

const logger = getLogger()

export const chatGPTSession = async ({
    apiKey = undefined,
    done = (response, message) => { },
    chunk = (chunk:any) => { },
    error = (error) => { },
    model = "gpt-4-turbo",
    max_tokens = 4096,
    ...props
}: ChatGPTRequest) => {
    const body: GPT4VCompletionRequest = {
        model,
        max_tokens,
        ...props
    }

    if (!apiKey) {
        apiKey = process.env.OPENAI_API_KEY;
    }

    if (!apiKey) {
        try {
            apiKey = await getKey({ key: "OPENAI_API_KEY", token: getServiceToken() });
        } catch (err) {
            console.error("Error fetching key:", err);
        }
    }

    if (!apiKey) {
        //logger.error("No API Key provided");
        error("No API Key provided");
        return {
            isError: true,
            data: {
                error: {
                    message: "No API Key provided",
                    code: "invalid_api_key"
                }
            }
        };
    }

    try {
        const client = new OpenAI({ apiKey });
        //@ts-ignore
        const stream = await client.chat.completions.create({
            ...body,
            stream: true,
        });
        let fullResponse

        for await (const currentChunk of stream) {
            if(!fullResponse) {
                fullResponse = Array.from({ length: currentChunk.choices.length }).map(() => "");
            }
            currentChunk.choices.forEach((choice, index) => {
                if(choice.delta.content){
                    fullResponse[index] += choice.delta.content
                }
            })
            await chunk(currentChunk); // Procesa el fragmento actual si lo necesitas en tiempo real
        }
        //console.log("fullResponse", fullResponse)
        done({choices: fullResponse}); // Procesa la respuesta completa

    } catch (e) {
        logger.error({ error: e.message || e, stack: e.stack }, "Error in chatGPTSession");
        if (error) error(e);
        return null;
    }
}


export const chatGPTPrompt = async ({
    message,
    ...props

}: ChatGPTRequest & { message: string }) => {
    let response = await chatGPTSession({
        messages: [
            {
                role: "user",
                content: message
            }
        ],
        ...props,
        done: (response) => {
            let message = ""
            if (response.choices && response.choices.length) {
                message = response.choices[0]
            }
            if (props.done) props.done(response, message)
        }
    })

    return response
}

type ChatGPTRequest = {
    apiKey?: string;
    done?: any;
    chunk?: (chunk: any) => any;
    error?: (error: any) => any;
} & GPT4VCompletionRequest

type GPT4VCompletionRequest = {
    model: "gpt-4-vision-preview" | "gpt-4-1106-preview" | "gpt-4-turbo" | "gpt-4-32k" | "gpt-4-0613" | "gpt-4-32k-0613" | "gpt-4-0314" | "gpt-4-32k-0314" | "gpt-4"; // https://platform.openai.com/docs/models/overview
    messages: Message[];
    functions?: any[] | undefined;
    function_call?: any | undefined;
    stream?: boolean | undefined;
    temperature?: number | undefined;
    top_p?: number | undefined;
    max_tokens?: number | undefined;
    n?: number | undefined;
    best_of?: number | undefined;
    frequency_penalty?: number | undefined;
    presence_penalty?: number | undefined;
    logit_bias?:
    | {
        [x: string]: number;
    }
    | undefined;
    stop?: (string[] | string) | undefined;
};

type Message = {
    role: "system" | "user" | "assistant" | "function";
    content: MessageContent;
    name?: string | undefined;
}

type MessageContent =
    | string // String prompt
    | (string | { type: "image_url"; image_url: string })[]; // Image asset 


export default {
    chatGPTSession,
    chatGPTPrompt
}