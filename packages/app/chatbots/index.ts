import { Protofy } from 'protobase'
import assistantChatbot from "./assistant";
import functionsCallsChatbot from "./functionsCallsChatbot";

const chatbots = Protofy("chatbots", {
    assistant: assistantChatbot,
    functionsCallsChatbot: functionsCallsChatbot
})

export default (app, context) => {
    Object.keys(chatbots).forEach((k) => {
        chatbots[k](app, context)
    })
}