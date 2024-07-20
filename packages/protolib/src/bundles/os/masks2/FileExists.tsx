import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme';
import { FileText } from '@tamagui/lucide-icons';

const FileExists = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(8);  // Un color diferenciado
    return (
        <Node icon={FileText} node={node} isPreview={!node.id} title='File Exists' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Path', field: 'mask-path', type: 'input' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['exists']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.fileExists',
    type: 'CallExpression',
    category: "OS",
    keywords: ['fs', 'os', 'file', 'check', 'exists'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.fileExists')
    },
    getComponent: (node, nodeData, children) => <FileExists node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            path: 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        path: 'input',
        done: { params: {'param-done': { key: "exists"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.fileExists',
            "mask-path": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}