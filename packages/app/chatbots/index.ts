import { Protofy } from 'protobase'
import assistantChatbot from "./assistant";

const chatbots = Protofy("chatbots", {
    assistant: assistantChatbot,
})

export default (app, context) => {
    Object.keys(chatbots).forEach((k) => {
        chatbots[k](app, context)
    })
}