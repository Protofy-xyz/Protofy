import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme'
import { Key } from '@tamagui/lucide-icons'

const GetKey = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(11)
    return (
        <Node icon={Key} node={node} isPreview={!node.id} title='Get Key' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'key', field: 'mask-key', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'token', field: 'mask-token', type: 'input' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'On Read'} vars={['key']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'keys.getKey',
    type: 'CallExpression',
    category: "System",
    keywords: ["key", "api", "apikey", "getkey", "get", "secret"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.keys.getKey')
    },
    getComponent: (node, nodeData, children) => <GetKey node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            key: 'input',
            token: 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        key: 'input',
        token: 'input',
        done: { params: {'param-done': { key: "key"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.keys.getKey',
            "param-1": {
                value: "{}",
                kind: "Identifier"
            },
            "mask-key": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-token": {
                value: "",
                kind: "Identifier"
            }
        }
    }
}
