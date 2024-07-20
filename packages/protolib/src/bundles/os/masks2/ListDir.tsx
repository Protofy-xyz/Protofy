import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme'
import { Folder } from '@tamagui/lucide-icons'

const ListDir = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(12)
    return (
        <Node icon={Folder} node={node} isPreview={!node.id} title='List Directory' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Path', field: 'mask-path', type: 'input' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['list']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.listDir',
    type: 'CallExpression',
    category: "OS",
    keywords: ['fs', 'os', 'read', 'directory', 'list'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.listDir')
    },
    getComponent: (node, nodeData, children) => <ListDir node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            path: 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        path: 'input',
        done: { params: {'param-done': { key: "list"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.listDir',
            "mask-path": {
                value: "/",
                kind: "StringLiteral"
            }
        }
    }
}