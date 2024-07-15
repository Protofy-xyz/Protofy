import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Truck } from '@tamagui/lucide-icons';

const MoveFile = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(5)
    return (
        <Node icon={Truck} node={node} isPreview={!node.id} title='Move File' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Source Path', field: 'mask-sourcePath', type: 'input' },
                { label: 'Destination Path', field: 'mask-destinationPath', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['path']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.moveFile',
    type: 'CallExpression',
    category: "OS",
    keywords: ['fs', 'os', 'file', 'move', 'rename'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.moveFile')
    },
    getComponent: (node, nodeData, children) => <MoveFile node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            'sourcePath': 'input',
            'destinationPath': 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        'sourcePath': 'input',
        'destinationPath': 'input',
        done: { params: {'param-done': { key: "path"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.moveFile',
            "mask-sourcePath": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-destinationPath": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}
