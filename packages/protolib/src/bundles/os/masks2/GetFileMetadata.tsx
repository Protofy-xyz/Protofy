import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme';
import { FileText } from '@tamagui/lucide-icons';

const GetFileMetadata = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(3);  // Un color que sugiere información o datos
    return (
        <Node icon={FileText} node={node} isPreview={!node.id} title='Get File Metadata' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Path', field: 'mask-path', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['metadata']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.getFileMetadata',
    type: 'CallExpression',
    category: "OS",
    keywords: ['fs', 'os', 'file', 'metadata', 'info'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.getFileMetadata')
    },
    getComponent: (node, nodeData, children) => <GetFileMetadata node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            'path': 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        'path': 'input',
        done: { params: {'param-done': { key: "metadata"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.getFileMetadata',
            "mask-path": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}
