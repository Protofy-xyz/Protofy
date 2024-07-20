import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme'
import { Terminal } from '@tamagui/lucide-icons'

const RunCommand = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(16)
    return (
        <Node icon={Terminal} node={node} isPreview={!node.id} title='Run command' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Command', field: 'mask-command', type: 'input' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'On Data'} vars={['data']} handleId={'mask-onData'} />
            <NodeOutput id={node.id} type={'input'} label={'On Error Data'} vars={['data']} handleId={'mask-onErrorData'} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['output']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'os2.runCommand',
    type: 'CallExpression',
    category: "OS",
    keywords: ['executor', 'os', 'command', 'spawn', 'process'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.runCommand')
    },
    getComponent: (node, nodeData, children) => <RunCommand node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            command: 'input',
            onDone: 'output',
            onError: 'output',
            onData: 'output',
            onErrorData: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        command: 'input',
        onDone: { params: {'param-onDone': { key: "output"}}},
        onError: { params: { 'param-onError': { key: "err"}}},
        onData: { params: {'param-onData': { key: "data"}}},
        onErrorData: { params: { 'param-onErrorData': { key: "data"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.runCommand',
            "mask-command": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}
