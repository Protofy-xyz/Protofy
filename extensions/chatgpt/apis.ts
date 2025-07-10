import { chatGPTPrompt, getChatGPTApiKey} from "./coreContext"
import { addAction } from "@extensions/actions/coreContext/addAction";
import { addCard } from "@extensions/cards/coreContext/addCard";
import { getLogger, getServiceToken } from 'protobase';
import { handler } from 'protonode'


export default (app, context) => {


    const registerActions = async (context) => {
        addAction({
            group: 'chatGPT',
            name: 'message',
            url: `/api/v1/chatgpt/send/prompt`,
            tag: "send",
            description: "send a chatGPT prompt",
            params: { prompt: "message value to send" },
            emitEvent: true,
            token: await getServiceToken()
        })
    }

    const registerCards = async (context) => {
        addCard({
            group: 'chatGPT',
            tag: "chat",
            id: 'chatGPT__chat_response',
            templateName: "chatGPT last chat response",
            name: "response",
            defaults: {
                width: 2,
                height: 8,
                name: "chatGPT_last_chat_response",
                icon: "openai",
                color: "#74AA9C",
                description: "chatGPT last chat response",
                rulesCode: `return states?.chatGPT?.conversation?.chatResponse`,
                type: 'value',
                html: "return markdown(data)",
            },
            emitEvent: true,
            token: await getServiceToken()
        })

            addCard({
        group: 'chatGPT',
        tag: "message",
        id: 'chatGPT_message_send',
        templateName: "chatGPT send message",
        name: "send_message",
        defaults: {
            width: 2,
            height: 8,
            name: "chatGPT_message_send",
            icon: "openai",
            color: "#74AA9C",
            description: "send a message to chatGPT",
            rulesCode: `return execute_action("/api/v1/chatgpt/send/prompt", { message: userParams.message});`,
            params: { message: "message",  },
            type: 'action'
        },
        emitEvent: true,
        token: await getServiceToken()
    })
    }

    app.get("/api/v1/chatgpt/send/prompt", handler(async (req, res, session) => {
        if (!session || !session.user.admin) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }
        const { message } = req.query;
        if(!message){
            res.status(400).send({ error: "Message parameter is required" });
            return;
        }

        try{
            await getChatGPTApiKey()
        }catch(err){
            res.json({ error: "Failed to retrieve ChatGPT API key. Please check your configuration." });
            return;
        }

        chatGPTPrompt({
            message: message, done: (response, msg) => {
                context.state.set({ group: 'chatGPT', tag: "conversation", name: "userMessage", value: message, emitEvent: true });
                context.state.set({ group: 'chatGPT', tag: "conversation", name: "chatResponse", value: msg, emitEvent: true });
            },error: (err)=>{
                context.state.set({ group: 'chatGPT', tag: "conversation", name: "chatResponse", value: err || "An error occurred", emitEvent: true });
            }
        })
        res.json({ message: "Prompt sent to ChatGPT" });
    }))
    registerActions(context);
    registerCards(context);

}

