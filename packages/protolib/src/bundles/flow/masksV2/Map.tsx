import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { MapPin } from 'lucide-react';

const MapNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(12)
    return (
        <Node icon={MapPin} node={node} isPreview={!node.id} title='Map List' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'List', field: 'mask-list', type: 'input' },
            ]} />
            <NodeParams id={node.id} params={[{ label: 'Mode', field: 'mask-mode', type: 'select', data: ["series", "manual"] }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'On Map'} vars={['item', 'next']} handleId={'mask-onMap'} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['list']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'flow2.map',
    type: 'CallExpression',
    category: "Flow",
    keywords: ['map', 'array', 'functional', 'flow', 'loop'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.flow2.map')
    },
    getComponent: (node, nodeData, children) => <MapNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            list: 'input',
            onMap: 'output',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        list: 'input',
        onMap: { params: {'param-item': { key: "item"}, 'param-next': { key: "next"}}},
        onDone: { params: {'param-list': { key: "list"}}},
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.flow2.map',
            "param-1": {
                value: "{}",
                kind: "Identifier"
            },
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