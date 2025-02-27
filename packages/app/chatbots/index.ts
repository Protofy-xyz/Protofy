import { Protofy } from 'protobase'
import assistantChatbot from "./assistant";
import eventChat from './eventChat';

const chatbots = Protofy("chatbots", {
    assistant: assistantChatbot,
    eventChat: eventChat
})

export default (app, context) => {
    Object.keys(chatbots).forEach((k) => {
        chatbots[k](app, context)
    })
}