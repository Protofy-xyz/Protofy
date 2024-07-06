import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { File } from 'lucide-react'

const ReadFile = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(12)
    return (
        <Node icon={File} node={node} isPreview={!node.id} title='Read File' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Path', field: 'mask-path', type: 'input' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['content']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.readFile',
    type: 'CallExpression',
    category: "OS",
    keywords: ['fs', 'os', 'read', 'file'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.readFile')
    },
    getComponent: (node, nodeData, children) => <ReadFile node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            path: 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        path: 'input',
        done: { params: {'param-done': { key: "content"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.readFile',
            "mask-path": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}
