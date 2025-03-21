import { Protofy } from 'protobase'
import assistantChatbot from "./assistant";
import boardChat from './board';

const chatbots = Protofy("chatbots", {
    assistant: assistantChatbot,
    board: boardChat
})

export default (app, context) => {
    Object.keys(chatbots).forEach((k) => {
        chatbots[k](app, context)
    })
}