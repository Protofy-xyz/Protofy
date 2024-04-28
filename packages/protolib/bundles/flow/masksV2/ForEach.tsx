import { Node, NodeOutput, NodeParams, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Split } from 'lucide-react';

const ForEach = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(10)
    return (
        <Node icon={Split} node={node} isPreview={!node.id} title='for Each' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'List', field: 'mask-list', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Mode', field: 'mask-mode', type: 'select', data: ["series", "parallel", "manual"] }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'On Each'} vars={['item', 'stop', 'next']} handleId={'mask-onEach'} />
            <NodeOutput id={node.id} type={'input'} label={'On Done'} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'On Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'flow2.forEach',
    type: 'CallExpression',
    category: "Flow",
    keywords: ["control", "loop", "for", "flow", "while", "foreach", "iterate", "iterator", "iterable", "list"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.flow2.forEach')
    },
    getComponent: (node, nodeData, children) => <ForEach node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            list: 'input',
            mode: 'output',
            onEach: 'output',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        list: 'input',
        mode: 'input',
        onEach: { params: {'param-item': { key: "item"}, 'param-stop': { key: "stop"}, 'param-next': { key: "next"}}},
        onDone: 'output',
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.flow2.forEach',
            "mask-list": {
                value: "",
                kind: "Identifier"
            },
            "mask-mode": {
                value: "series",
                kind: "StringLiteral"
            }
        }
    }
}
