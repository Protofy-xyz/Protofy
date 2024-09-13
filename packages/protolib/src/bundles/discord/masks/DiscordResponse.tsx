import { Node, NodeParams, NodeOutput, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { MessageCircle } from '@tamagui/lucide-icons';

const DiscordResponse = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(11);
    return (
        <Node icon={MessageCircle} node={node} isPreview={!node.id} title='Discord Bot Response' color={color} id={node.id} skipCustom={true}>
            <NodeParams
                id={node.id}
                params={[{ label: 'Message', field: 'mask-message', type: 'input', defaultValue: 'message' }]}
            />
            <NodeParams
                id={node.id}
                params={[{ label: 'Response', field: 'mask-response', type: 'input', defaultValue: 'Pong!' }]}
            />
            <div style={{ height: '30px' }} />
            <NodeOutput
                id={node.id}
                type={'output'}
                label={'On Send'}
                handleId={'mask-onSend'}
            />
        </Node>
    );
};

export default {
    id: 'discord.response',
    type: 'CallExpression',
    category: "System",
    keywords: ["discord", "message", "send", "response"],

    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.discord.response');
    },

    getComponent: (node, nodeData, children) => <DiscordResponse node={node} nodeData={nodeData} children={children} />,

    filterChildren: filterObject({
        keys: {
            message: 'input',
            response: 'input',
            onSend: 'output'
        }
    }),

    restoreChildren: restoreObject({
        keys: {
            message: 'input',
            response: 'input',
            onSend: { params: {} }
        }
    }),

    getInitialData: () => {
        return {
            await: true,
            to: 'context.discord.response',
            "mask-response": {
                value: "Pong!",
                kind: "StringLiteral"
            },
            "mask-message": {
                value: "message",
                kind: "Identifier"
            }
        };
    }
};
