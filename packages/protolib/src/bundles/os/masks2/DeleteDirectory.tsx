import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Trash2 } from '@tamagui/lucide-icons';

const DeleteDirectory = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(1)
    return (
        <Node icon={Trash2} node={node} isPreview={!node.id} title='Delete Directory' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Path', field: 'mask-path', type: 'input' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={[]} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.deleteDirectory',
    type: 'CallExpression',
    category: "OS",
    keywords: ['fs', 'os', 'directory', 'delete', 'remove', 'recursive'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.deleteDirectory')
    },
    getComponent: (node, nodeData, children) => <DeleteDirectory node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            path: 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        path: 'input',
        done: { params: {'param-done': { key: ""}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.deleteDirectory',
            "mask-path": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}
