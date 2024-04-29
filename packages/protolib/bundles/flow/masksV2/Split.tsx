import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Scissors } from 'lucide-react';

const SplitNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(18)
    return (
        <Node icon={Scissors} node={node} isPreview={!node.id} title='Split Text' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Text', field: 'mask-text', type: 'input' },
                { label: 'Separator', field: 'mask-separator', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['list']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'flow2.split',
    type: 'CallExpression',
    category: "Flow",
    keywords: ['split', 'string', 'text'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.flow2.split')
    },
    getComponent: (node, nodeData, children) => <SplitNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            text: 'input',
            separator: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        text: 'input',
        separator: 'input',
        onDone: { params: {'param-list': { key: "list"}}},
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.flow2.split',
            "mask-text": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-separator": {
                value: "\\n",
                kind: "StringLiteral"
            }
        }
    }
}