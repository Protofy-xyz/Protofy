import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { FileText } from '@tamagui/lucide-icons';

const SetContext = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(8);
    return (
        <Node icon={FileText} node={node} isPreview={!node.id} title='Set Context' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Group', field: 'mask-group', type: 'input' },
                { label: 'Tag', field: 'mask-tag', type: 'input' },
                { label: 'Name', field: 'mask-name', type: 'input' },
                { label: 'Value', field: 'mask-value', type: 'input' }
            ]} />
            <div style={{height: '3px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['value']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'state.set',
    type: 'CallExpression',
    category: "State",
    keywords: ['state', 'set', 'setContext', 'context', 'memory'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.state.set')
    },
    getComponent: (node, nodeData, children) => <SetContext node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            'group': 'input',
            'tag': 'input',
            'name': 'input',
            'value': 'input',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        'group': 'input',
        'tag': 'input',
        'name': 'input',
        'value': 'input',
        done: { params: {'param-done': { key: "value"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.state.set',
            "mask-group": {
                value: "automations",
                kind: "StringLiteral"
            },
            "mask-tag": {
                value: "example",
                kind: "StringLiteral"
            },
            "mask-name": {
                value: "name",
                kind: "StringLiteral"
            },
            "mask-value": {
                value: "value",
                kind: "StringLiteral"
            }
        }
    }
}
