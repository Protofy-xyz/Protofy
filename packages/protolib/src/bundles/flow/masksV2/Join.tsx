import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Link } from '@tamagui/lucide-icons';

const JoinNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(18)
    return (
        <Node icon={Link} node={node} isPreview={!node.id} title='Join List' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'List', field: 'mask-list', type: 'input' },
                { label: 'Separator', field: 'mask-separator', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['result']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'flow2.join',
    type: 'CallExpression',
    category: "Flow",
    keywords: ['join', 'list', 'string'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.flow2.join')
    },
    getComponent: (node, nodeData, children) => <JoinNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            list: 'input',
            separator: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        list: 'input',
        separator: 'input',
        onDone: { params: {'param-result': { key: "result"}}},
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.flow2.join',
            "mask-list": {
                value: "",
                kind: "Identifier"
            },
            "mask-separator": {
                value: "\\n",
                kind: "StringLiteral"
            }
        }
    }
}