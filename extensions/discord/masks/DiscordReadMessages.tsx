import { Node, NodeParams, NodeOutput, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { MessageCircle } from '@tamagui/lucide-icons';

const DiscordReadMessages = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(11);
    return (
        <Node icon={MessageCircle} node={node} isPreview={!node.id} title='Read Channel Messages' color={color} id={node.id} skipCustom={true}>
            <NodeParams 
                id={node.id} 
                params={[{ label: 'Channel ID', field: 'mask-channelId', type: 'input', defaultValue: '' }]} 
            />
            <NodeParams 
                id={node.id} 
                params={[{ label: 'Message Limit', field: 'mask-limit', type: 'input', defaultValue: 0 }]} 
            />
            <div style={{ height: '30px' }} />
            <NodeOutput 
                id={node.id} 
                type={'output'} 
                label={'On Messages Read'} 
                vars={['messages']} 
                handleId={'mask-onMessagesRead'} 
            />
        </Node>
    );
};

export default {
    id: 'discord.readMessages',
    type: 'CallExpression',
    category: "System",
    keywords: ["discord", "messages", "read", "channel"],

    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.discord.readMessages');
    },

    getComponent: (node, nodeData, children) => <DiscordReadMessages node={node} nodeData={nodeData} children={children} />,

    filterChildren: filterObject({
        keys: {
            channelId: 'input',
            limit: 'input',
            onMessagesRead: 'output'
        }
    }),

    restoreChildren: restoreObject({
        keys: {
            channelId: 'input',
            limit: 'input',
            onMessagesRead: { params: { 'param-messages': { key: "messages" } } }
        }
    }),

    getInitialData: () => {
        return {
            await: true,
            to: 'context.discord.readMessages',
            "mask-channelId": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-limit": {
                value: 0, // Default value
                kind: "NumericLiteral"
            }
        };
    }
};
