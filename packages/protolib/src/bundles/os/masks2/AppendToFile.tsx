import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme';
import { FilePlus } from '@tamagui/lucide-icons';

const AppendToFile = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(7);  // Un color que sugiere adición o crecimiento
    return (
        <Node icon={FilePlus} node={node} isPreview={!node.id} title='Append To File' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Path', field: 'mask-path', type: 'input' },
                { label: 'Content', field: 'mask-content', type: 'input' }
            ]} />
            <NodeParams id={node.id} params={[{ label: 'Add line break', field: 'mask-line', type: 'boolean', static: true }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['path']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.appendToFile',
    type: 'CallExpression',
    category: "OS",
    keywords: ['fs', 'os', 'file', 'append', 'write', 'add'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.appendToFile')
    },
    getComponent: (node, nodeData, children) => <AppendToFile node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            'path': 'input',
            'content': 'input',
            'line': 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        'path': 'input',
        'content': 'input',
        'line': 'input',
        done: { params: {'param-done': { key: "path"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.appendToFile',
            "mask-line": { 
                value: "false", 
                kind: "FalseKeyword" 
            },
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
