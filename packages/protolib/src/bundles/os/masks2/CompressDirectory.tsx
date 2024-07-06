import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Package } from 'lucide-react';

const CompressDirectory = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(9)
    return (
        <Node icon={Package} node={node} isPreview={!node.id} title='Zip' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Source Path', field: 'mask-sourcePath', type: 'input' },
                { label: 'Output Path', field: 'mask-outputPath', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['path']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.compressDirectory',
    type: 'CallExpression',
    category: "OS",
    keywords: ['fs', 'os', 'directory', 'compress', 'zip'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.compressDirectory')
    },
    getComponent: (node, nodeData, children) => <CompressDirectory node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            'sourcePath': 'input',
            'outputPath': 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        'sourcePath': 'input',
        'outputPath': 'input',
        done: { params: {'param-done': { key: "path"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.compressDirectory',
            "mask-sourcePath": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-outputPath": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}
