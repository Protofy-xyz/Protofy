
const callModel = async (prompt, context, options?) => {
    let reply;
    if (options?.useChatGPT) {
        reply = await context.chatgpt.chatGPTPrompt({
            message: prompt
        })

        let content = reply[0]

        if (reply.isError) {
            content = "// Error: " + reply.data.error.message
        }

        reply = {
            choices: [
                {
                    message: {
                        content
                    }
                }
            ]
        }
    } else {
        reply = await context.lmstudio.chatWithModel(prompt, 'qwen2.5-coder-32b-instruct')
    }
    return reply
}

const cleanCode = (code) => {
    //remove ```(plus anything is not an space) from the beginning of the code
    //remove ``` from the end of the code
    let cleaned = code.replace(/^```[^\s]+/g, '').replace(/```/g, '').trim()
    //remove 'javascript' from the beginning of the code if it exists
    if (cleaned.startsWith('javascript')) {
        cleaned = cleaned.replace('javascript', '').trim()
    }
    return cleaned
}


export const ai = {
    callModel: async (prompt, context, options) => {
        return await callModel(prompt, context, options)
    },
    cleanCode: (code) => {
        return cleanCode(code)
    }
} 