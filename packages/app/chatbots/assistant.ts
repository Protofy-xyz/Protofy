import { getAuth } from 'protonode'
import { APIContext } from "protolib/bundles/apiContext"
import { API, Protofy, getLogger } from "protobase";
import { Application } from 'express';
import fs from 'fs'
import path from "path";
import { createChatbot } from "protolib/bundles/chatbots/createChatbot";

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
    createChatbot(app, 'assistant', async (req, res, chatbot) => {
        const {metadata, ...body} = req.body

        const {session, token} = getAuth(req)
        context.chatGPT.chatGPTPrompt({
            ...body,
            messages: transformChats(body.messages, metadata.context),
            done: (response, message) => {
                chatbot.end()
            },
            chunk: (chunk) => {
                chatbot.sendRaw(chunk)
            },
            error: (error) => {
                chatbot.sendError(error)
            }
        })
    })
})