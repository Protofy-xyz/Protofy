import { getAuth } from 'protonode'
import { APIContext } from "protolib/bundles/apiContext"
import { Protofy, getLogger } from "protobase";
import { Application } from 'express';
import path from "path";
import { createChatbot } from "protolib/bundles/chatbots/createChatbot";
import { emitEvent } from 'protolib/bundles/events/api';

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "chatGPT")

function transformChats(prevChats, prompt: string) {
    const additionalSystemMessage = {
      role: "system",
      content: prompt
    };
    return [additionalSystemMessage, ...prevChats];
  }

export default Protofy("code", async (app:Application, context: typeof APIContext) => {
    createChatbot(app, 'eventChat', async (req, res, chatbot) => {
        const {metadata, ...body} = req.body

        const {session, token} = getAuth(req)
        const message = "Message received"
        chatbot.send(message)
        emitEvent("message/create", session.user.id, "eventChat", {message: body.messages[body.messages.length - 1].content})
        chatbot.end()

    })
})