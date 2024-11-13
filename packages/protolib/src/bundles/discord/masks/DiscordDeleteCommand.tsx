import { Node, NodeParams, NodeOutput, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { MessageCircle } from '@tamagui/lucide-icons';

const DiscordDeleteCommand = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(11);
    return (
        <Node icon={MessageCircle} node={node} isPreview={!node.id} title='Discord Bot Delete Command' color={color} id={node.id} skipCustom={true}>
            <NodeParams
                id={node.id}
                params={[
                    { label: 'Discord Commane Name', field: 'mask-commandName', type: 'input', defaultValue: '' },
                    { label: 'Discord GuildId', field: 'mask-guildId', type: 'input', defaultValue: '' },
                    { label: 'Discord ClientId', field: 'mask-clientId', type: 'input', defaultValue: '' },
                    { label: 'Discord ApiKey', field: 'mask-apiKey', type: 'input', defaultValue: '' },
                ]}
            />
        </Node>
    );
};

export default {
    id: 'discord.deleteCommand',
    type: 'CallExpression',
    category: "System",
    keywords: ["discord", "delete", "command"],

    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.discord.deleteCommand');
    },

    getComponent: (node, nodeData, children) => <DiscordDeleteCommand node={node} nodeData={nodeData} children={children} />,

    filterChildren: filterObject({
        keys: {
            commandName: 'input',
            guildId: 'input',
            clientId: 'input',
            apiKey: 'input',
        }
    }),

    restoreChildren: restoreObject({
        keys: {
            commandName: 'input',
            guildId: 'input',
            clientId: 'input',
            apiKey: 'input',
        }
    }),

    getInitialData: () => {
        return {
            await: true,
            to: 'context.discord.deleteCommand',
            "mask-commandName": {
                value: "",
                kind: "StringLiteral"
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
            }
        };
    }
};
