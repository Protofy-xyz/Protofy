export const createChatbot = (app, name, onMessage) => {
    console.log("Creating chatbot", name)
    app.post('/api/v1/chatbots/' + name, (req, res) => {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        const send = (data) => {
            res.write(`data: ${JSON.stringify({
                choices: [{delta: {content: data}}]
            })}\n\n`);
        }
        const sendRaw = (data) => {
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
        const end = () => {
            res.write("data: [DONE]\n\n");
            res.end();
        }
        const sendError = (error) => {
            res.write(`data: ${JSON.stringify({
                error: {
                    message: error.message,
                    code: error.code
                }
            })}\n\n`);
            res.end();
        }
        onMessage(req, res, {send, end, sendRaw, sendError})
    })
}
