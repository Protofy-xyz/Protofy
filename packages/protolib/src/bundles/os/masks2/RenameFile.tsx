import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Edit2 } from '@tamagui/lucide-icons';

const RenameFile = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(6);  // Un color neutral
    return (
        <Node icon={Edit2} node={node} isPreview={!node.id} title='Rename File' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Old Path', field: 'mask-oldPath', type: 'input' },
                { label: 'New Path', field: 'mask-newPath', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['path']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.renameFile',
    type: 'CallExpression',
    category: "OS",
    keywords: ['fs', 'os', 'file', 'rename', 'move'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.renameFile')
    },
    getComponent: (node, nodeData, children) => <RenameFile node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            'oldPath': 'input',
            'newPath': 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        'oldPath': 'input',
        'newPath': 'input',
        done: { params: {'param-done': { key: "path"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.renameFile',
            "mask-oldPath": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-newPath": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}
