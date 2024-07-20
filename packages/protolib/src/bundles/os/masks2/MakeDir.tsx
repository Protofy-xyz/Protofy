import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme'
import { FolderPlus } from '@tamagui/lucide-icons'

const MakeDir = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(10)  // Cambio de color para diferenciar del ListDir
    return (
        <Node icon={FolderPlus} node={node} isPreview={!node.id} title='Make Directory' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Path', field: 'mask-path', type: 'input' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['path']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.makeDir',
    type: 'CallExpression',
    category: "OS",
    keywords: ['fs', 'os', 'create', 'directory', 'mkdir'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.makeDir')
    },
    getComponent: (node, nodeData, children) => <MakeDir node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            path: 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        path: 'input',
        done: { params: {'param-done': { key: "path"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.makeDir',
            "mask-path": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}