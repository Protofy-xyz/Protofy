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

const get_name = (args) => {
    console.log("args: ", args);
    const dateTime = new Date().toLocaleString();
    return "Your name is " + args.name + " - " + dateTime;
}

const tool_handlers = {
    "get_name": get_name
}

const tools = [
    {
        name: "get_name",
        description: "Get the name of a user",
        parameters: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "the user name"
                }
            },
            required: ["name"],
            additionalProperties: false
        }
    }
];

function transformChats(prevChats, prompt: string) {
    const additionalSystemMessage = {
        role: "system",
        content: prompt
    };
    return [additionalSystemMessage, ...prevChats];
}

function reduceArgsChunks(chunks) {
    const result = chunks.reduce((acc, curr) => {
        console.log("current: ", JSON.stringify(curr.choices[0], null, 2))
        return acc + curr.choices[0].delta.function_call.arguments
    }, "")

    console.log("functionName: ", chunks[0].choices[0])
    return {
        function_name: chunks[0].choices[0]?.delta?.function_call?.name ?? "unknown",
        result: result
    }
}

export default Protofy("code", async (app: Application, context: typeof APIContext) => {
    createChatbot(app, 'functionCall', async (req, res, chatbot) => {
        const { metadata, ...body } = req.body
        const { session, token } = getAuth(req)

        let chunks = []
        context.chatGPT.chatGPTPrompt({
            ...body,
            functions: tools,
            messages: transformChats(body.messages, metadata.context),
            done: (response, message) => {
                // tool_call response
                if (chunks[chunks.length - 1].choices[0].finish_reason === "function_call") {
                    chunks.pop() // remove termination chunk
                    const chunksResult = reduceArgsChunks(chunks)
                    chunks = []

                    if (chunksResult && tool_handlers[chunksResult.function_name]) {
                        const argsObject = JSON.parse(chunksResult.result)
                        console.log("argsObject", argsObject)
                        const response = tool_handlers[chunksResult.function_name](argsObject)
                        console.log(response)
                        chatbot.send(response)
                        chatbot.end()
                        return
                    }

                    chatbot.send("Cannot generate a response try again")
                    chatbot.end()
                    return
                }

                // chat gpt response
                if (response) {
                    console.log("response", response)
                    chatbot.send("automatic response")
                    chatbot.end()
                    return
                }
            },
            chunk: (chunk) => {
                chunks.push(chunk)
            },
            error: (error) => {
                chatbot.sendError(error)
            }
        })
    })
})