import { Node, NodeParams, NodeOutput, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { MessageCircle } from '@tamagui/lucide-icons';

const DiscordSend = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(11);
    return (
        <Node icon={MessageCircle} node={node} isPreview={!node.id} title='Discord Bot Send' color={color} id={node.id} skipCustom={true}>
            <NodeParams
                id={node.id}
                params={[{ label: 'Message', field: 'mask-message', type: 'input', defaultValue: 'Pong!' }]}
            />
            <NodeParams
                id={node.id}
                params={[{ label: 'Channel', field: 'mask-channel', type: 'input', defaultValue: '' }]}
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
    id: 'discord.send',
    type: 'CallExpression',
    category: "System",
    keywords: ["discord", "message", "send", "response"],

    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.discord.send');
    },

    getComponent: (node, nodeData, children) => <DiscordSend node={node} nodeData={nodeData} children={children} />,

    filterChildren: filterObject({
        keys: {
            message: 'input',
            channel: 'input',
            onSend: 'output'
        }
    }),

    restoreChildren: restoreObject({
        keys: {
            message: 'input',
            channel: 'input',
            onSend: { params: {} }
        }
    }),

    getInitialData: () => {
        return {
            await: true,
            to: 'context.discord.send',
            "mask-message": {
                value: "Hello!",
                kind: "StringLiteral"
            },
            "mask-channel": {
                value: "",
                kind: "StringLiteral"
            }
        };
    }
};
