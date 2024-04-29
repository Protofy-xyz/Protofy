import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Filter } from 'lucide-react';

const FilterNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(12)
    return (
        <Node icon={Filter} node={node} isPreview={!node.id} title='Filter List' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'List', field: 'mask-list', type: 'input' },
            ]} />
            <NodeParams id={node.id} params={[{ label: 'Mode', field: 'mask-mode', type: 'select', data: ["series", "manual"] }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'On Filter'} vars={['item', 'accept', 'reject']} handleId={'mask-onFilter'} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['list']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'flow2.filter',
    type: 'CallExpression',
    category: "Flow",
    keywords: ['filter', 'array', 'functional', 'flow', 'loop'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.flow2.filter')
    },
    getComponent: (node, nodeData, children) => <FilterNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            list: 'input',
            onFilter: 'output',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        list: 'input',
        onFilter: { params: {'param-item': { key: "item"}, 'param-accept': { key: "accept"}, 'param-reject': { key: "reject"}}},
        onDone: { params: {'param-list': { key: "list"}}},
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.flow2.filter',
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