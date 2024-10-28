import {Protofy} from 'protobase'

const chatbots = Protofy("chatbots", {
})

export default (app, context) => {
    Object.keys(chatbots).forEach((k) => {
        chatbots[k](app, context)
    })
}