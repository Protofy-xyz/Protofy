import { z } from 'protobase'
import { Router, Database, DatabaseZap, RefreshCcwDot, PencilRuler, MessageCircle, Sparkles, FunctionSquare } from '@tamagui/lucide-icons'

export const chatbotTemplates = {
    "custom-chatbot": {
        id: "custom-chatbot",
        name: "Custom",
        description: 'Creates a chatbot that can be used in your website',
        icon: MessageCircle
    },
    "chatgpt-chatbot": {
        id: "chatgpt-chatbot",
        name: "ChatGPT",
        description: 'Creates a chatbot based on chatGPT that can be used in your website',
        icon: Sparkles
    }
    // "python-chatbot": {
    //     id: "python-chatbot",
    //     name: "Python Chatbot",
    //     description: 'Creates a python chatbot that can be used in your website',
    //     icon: PencilRuler
    // }
}
