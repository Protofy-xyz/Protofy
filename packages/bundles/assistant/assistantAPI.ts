
import { handler } from 'protonode'
import { chatGPTSession } from '@bundles/chatgpt/context'

export function AssistantAPI(app, context) {
    app.post('/api/core/v1/assistant', handler(async (req: any, res: any) => {
        let { messages, gptModel } = req.body;

        try {
            const response = await chatGPTSession({
                messages: messages,                
                model: gptModel ?? "gpt-4-turbo",
                temperature: 0,
            });
        
            res.json(response);
        } catch (e) {
            console.log(e);
            res.status(501).send(e);
        }
    }));
}