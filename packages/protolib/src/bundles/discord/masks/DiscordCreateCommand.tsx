import { Node, NodeParams, NodeOutput, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { MessageCircle } from '@tamagui/lucide-icons';

const DiscordCreateCommand = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(11);
    return (
        <Node icon={MessageCircle} node={node} isPreview={!node.id} title='Discord Bot Create Command' color={color} id={node.id} skipCustom={true}>
            <NodeParams
                id={node.id}
                params={[
                    { label: 'Discord Command', field: 'mask-command', type: 'input', defaultValue: '' },
                    { label: 'Discord GuildId', field: 'mask-guildId', type: 'input', defaultValue: '' },
                    { label: 'Discord ClientId', field: 'mask-clientId', type: 'input', defaultValue: '' },
                    { label: 'Discord ApiKey', field: 'mask-apiKey', type: 'input', defaultValue: '' },
                    { label: 'Overwrite', field: 'mask-overwrite', type: 'boolean', defaultValue: undefined }
                ]}
            />
        </Node>
    );
};

export default {
    id: 'discord.createCommand',
    type: 'CallExpression',
    category: "System",
    keywords: ["discord", "create", "command"],

    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.discord.createCommand');
    },

    getComponent: (node, nodeData, children) => <DiscordCreateCommand node={node} nodeData={nodeData} children={children} />,

    filterChildren: filterObject({
        keys: {
            command: 'input',
            guildId: 'input',
            clientId: 'input',
            apiKey: 'input',
            overwrite: 'boolean'
        }
    }),

    restoreChildren: restoreObject({
        keys: {
            command: 'input',
            guildId: 'input',
            clientId: 'input',
            apiKey: 'input',
            overwrite: 'boolean'
        }
    }),

    getInitialData: () => {
        return {
            await: true,
            to: 'context.discord.createCommand',
            "mask-command": {
                value: "",
                kind: "Identifier"
            },
            "mask-guildId": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-clientId": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-apiKey": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-overwrite": {
                value: undefined,
                kind: "Identifier"
            }
        };
    }
};
