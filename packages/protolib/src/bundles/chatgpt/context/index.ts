import { getLogger } from "protobase";
import { getServiceToken } from '../../apis/context';
import { getKey } from "../../keys/context";

const logger = getLogger()

export const chatGPTSession = async ({
    apiKey = undefined,
    done = (response, message) => { },
    error = (error) => { },
    model = "gpt-4o",
    max_tokens = 4096,
    ...props
}: ChatGPTRequest) => {

    const body: GPT4VCompletionRequest = {
        model,
        max_tokens,
        ...props
    }

    try {
        apiKey = await getKey({ key: "OPENAI_API_KEY", token: getServiceToken() });
    } catch (err) {
        console.error("Error fetching key:", err);
    }
    
    if (!apiKey) {
        apiKey = process.env.OPENAI_API_KEY;
    }

    if (!apiKey) {
        //logger.error("No API Key provided");
        error("No API Key provided");
        return {
            isError: true,
            data:{error: {
                message: "No API Key provided",
                code: "invalid_api_key"
            }}
        };
    }
    
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + apiKey,
            },
            body: JSON.stringify(body),
        });
        const json = await response.json();
        if (done) done(json);
        return json;
    } catch (e) {
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
                message = response.choices[0].message.content
            }
            if (props.done) props.done(response, message)
        }
    })

    return response
}

type ChatGPTRequest = {
    apiKey?: string;
    done?: any;
    error?: (error: any) => any;
} & GPT4VCompletionRequest

type GPT4VCompletionRequest = {
    model: "gpt-4-vision-preview" | "gpt-4-1106-preview" | "gpt-4" | "gpt-4-32k" | "gpt-4-0613" | "gpt-4-32k-0613" | "gpt-4-0314" | "gpt-4-32k-0314" | "gpt-4o"; // https://platform.openai.com/docs/models/overview
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