import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { PlusSquare } from 'lucide-react';

const PushNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(12)
    return (
        <Node icon={PlusSquare} node={node} isPreview={!node.id} title='Push to list' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'List', field: 'mask-list', type: 'input' },
                { label: 'Item', field: 'mask-item', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['list']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'flow2.push',
    type: 'CallExpression',
    category: "Flow",
    keywords: ['push', 'list', 'add', 'array'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.flow2.push')
    },
    getComponent: (node, nodeData, children) => <PushNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            list: 'input',
            item: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        list: 'input',
        item: 'input',
        onDone: { params: {'param-list': { key: "list"}}},
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.flow2.push',
            "param-1": {
                value: "{}",
                kind: "Identifier"
            },
            "mask-list": {
                value: "",
                kind: "Identifier"
            },
            "mask-item": {
                value: "",
                kind: "Identifier"
            }
        }
    }
}