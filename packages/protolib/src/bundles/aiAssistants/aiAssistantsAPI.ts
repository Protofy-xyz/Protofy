
import { handler } from 'protonode'
import { chatGPTSession } from '../chatgpt/context'

const MAX_TOKENS = 4096

export function AiAssistantsAPI(app, context) {
    app.post('/adminapi/v1/assistants', handler(async (req: any, res: any) => {
        let { messages, gptModel } = req.body;

        try {
            const response = await chatGPTSession({
                apiKey: process.env.OPENAI_API_KEY,
                messages: messages,
                model: gptModel ?? "gpt-4-1106-preview",
                max_tokens: MAX_TOKENS
            });
        
            res.json(response);
        } catch (e) {
            console.log(e);
            res.status(501).send(e);
        }
    }));
}