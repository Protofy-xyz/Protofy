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

export default Protofy("code", async (app:Application, context: typeof APIContext) => {
    createChatbot(app, '{{codeNameLowerCase}}', async (req, res, chatbot) => {
        const {session, token} = getAuth(req)
        context.chatGPT.chatGPTPrompt({
            ...req.body,
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