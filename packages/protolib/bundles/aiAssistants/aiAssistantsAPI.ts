
import { handler } from 'protolib/api'
const MAX_TOKENS = 4096

export function AiAssistantsAPI(app, context) {
    app.post('/adminapi/v1/assistants', handler(async (req: any, res: any) => {
        let { messages, gptModel } = req.body;
        const body: GPT4VCompletionRequest = {
            model: gptModel ?? "gpt-4-1106-preview",
            max_tokens: MAX_TOKENS,
            messages: messages,
        };
        let json = null;
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify(body),
            });
            json = await response.json();
            res.json(json)
        } catch (e) {
            console.log(e);
            res.status(501).send(e)
        }
    }));
}

export type GPT4VCompletionRequest = {
    model: "gpt-4-vision-preview" | "gpt-4-1106-preview" | "gpt-4" | "gpt-4-32k" | "gpt-4-0613" | "gpt-4-32k-0613" | "gpt-4-0314" | "gpt-4-32k-0314"; // https://platform.openai.com/docs/models/overview
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
