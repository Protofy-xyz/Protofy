import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Cable } from '@tamagui/lucide-icons';

const Rewire = ({ node = {}, nodeData = {}, children }: any) => {

    const color = useColorFromPalette(34)
    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Flow Variable' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Name', field: 'mask-name', type: 'input' },
                { label: 'Value', field: 'mask-value', type: 'input' },
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={[nodeData['mask-name']?.value]} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'flow2.rewire',
    type: 'CallExpression',
    category: "Flow",
    keywords: ['rewire', 'variable', 'value', 'declare', 'assign', 'set', 'change'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.flow2.rewire')
    },
    getComponent: (node, nodeData, children) => <Rewire node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            name: 'input',
            value: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges, nodeData) => {
        const name = nodeData[node.id]['mask-name'].value
        return restoreObject({keys: {
        name: 'input',
        value: 'input',
        onDone: { params: {'param-x': { key: name}}},
        onError: { params: { 'param-err': { key: "err"}}}
        }})(node, nodes, originalNodes, edges, originalEdges, nodeData)
    },
    getInitialData: () => {
        return {
            await: true,
            to: 'context.flow2.rewire',
            "mask-value": {
                value: "",
                kind: "Identifier"
            },
            "mask-name": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}