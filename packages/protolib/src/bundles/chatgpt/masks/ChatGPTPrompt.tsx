import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme'
import { MessageCircle } from '@tamagui/lucide-icons'

const ChatGPTPrompt = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(11)
    return (
        <Node icon={MessageCircle} node={node} isPreview={!node.id} title='Chat GPT Prompt' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'message', field: 'mask-message', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'model', field: 'mask-model', type: 'select', data: ["gpt-4-1106-preview", "gpt-4-vision-preview", "gpt-4", "gpt-4-32k", "gpt-4-0613", "gpt-4-32k-0613", "gpt-4-0314", "gpt-4-32k-0314"] }]} />
            <NodeParams id={node.id} params={[{ label: 'max tokens', field: 'mask-max_tokens', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'api key', field: 'mask-apiKey', type: 'input' }]} />
            <div style={{ height: '30px' }} />
            <NodeOutput id={node.id} type={'input'} label={'On Response'} vars={['response', 'message']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'On Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'chatGPT.chatGPTPrompt',
    type: 'CallExpression',
    category: "System",
    keywords: ["prompt", "chat", "gpt", "chatgpt", "openai", "ai", "bot"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.chatGPT.chatGPTPrompt')
    },
    getComponent: (node, nodeData, children) => <ChatGPTPrompt node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({
        keys: {
            message: 'input',
            apiKey: 'input',
            model: 'input',
            max_tokens: 'input',
            done: 'output',
            error: 'output'
        }
    }),
    restoreChildren: restoreObject({
        keys: {
            message: 'input',
            apiKey: 'input',
            model: 'input',
            max_tokens: 'input',
            done: { 
                params: { 
                    'param-response': { 
                        key: "response" 
                    },
                    'param-message': { 
                        key: "message" 
                    }  
                },
            },
            error: { params: { 'param-error': { key: "err" } } }
        }
    }),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.chatGPT.chatGPTPrompt',
            "param-1": {
                value: "{}",
                kind: "Identifier"
            },
            "mask-message": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-apiKey": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-model": {
                value: "gpt-4-1106-preview",
                kind: "StringLiteral"
            },
            "mask-max_tokens": {
                value: "4096",
                kind: "NumericLiteral"
            }
        }
    }
}
