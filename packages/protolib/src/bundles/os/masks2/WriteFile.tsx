import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme'
import { Save } from '@tamagui/lucide-icons'

const WriteFile = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(12)
    return (
        <Node icon={Save} node={node} isPreview={!node.id} title='Write File' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Path', field: 'mask-path', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Content', field: 'mask-content', type: 'input' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.writeFile',
    type: 'CallExpression',
    category: "OS",
    keywords: ['fs', 'os', 'write', 'file'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.writeFile')
    },
    getComponent: (node, nodeData, children) => <WriteFile node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            path: 'input',
            content: 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        path: 'input',
        content: 'input',
        done: 'output',
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.writeFile',
            "mask-path": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-content": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}
