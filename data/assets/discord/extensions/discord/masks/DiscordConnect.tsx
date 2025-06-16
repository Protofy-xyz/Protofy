import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { MessageCircle } from '@tamagui/lucide-icons';

const DiscordConnect = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(11);
    return (
        <Node icon={MessageCircle} node={node} isPreview={!node.id} title='Discord Bot Connect' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'API Key', field: 'mask-apiKey', type: 'input' }]} />
            <div style={{ height: '30px' }} />
            <NodeOutput id={node.id} type={'output'} label={'On Message'} vars={['message']} handleId={'mask-onMessage'} />
            <NodeOutput id={node.id} type={'output'} label={'On Connect'} vars={['client']} handleId={'mask-onConnect'} />
            <NodeOutput id={node.id} type={'output'} label={'On Disconnect'} vars={['client']} handleId={'mask-onDisconnect'} />
            <NodeOutput id={node.id} type={'output'} label={'On Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    );
};

export default {
    id: 'discord.connect',
    type: 'CallExpression',
    category: "System",
    keywords: ["discord", "bot", "connect"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.discord.connect');
    },
    getComponent: (node, nodeData, children) => <DiscordConnect node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({
        keys: {
            apiKey: 'input',
            onMessage: 'output',
            onConnect: 'output',
            onDisconnect: 'output',
            onError: 'output'
        }
    }),
    restoreChildren: restoreObject({
        keys: {
            apiKey: 'input',
            onMessage: { params: { 'param-message': { key: "message" } } },
            onConnect: { params: { 'param-client': { key: "client" } } },
            onDisconnect: { params: { 'param-client': { key: "client" } } },
            onError: { params: { 'param-error': { key: "err" } } }
        }
    }),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.discord.connect',
            "mask-apiKey": {
                value: "",
                kind: "StringLiteral"
            }
        };
    }
};
