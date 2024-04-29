import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Blocks } from 'lucide-react';

const AddObjectKey = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(67)
    return (
        <Node icon={Blocks} node={node} isPreview={!node.id} title='Add Object Key' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Object', field: 'mask-object', type: 'input' },
                { label: 'Key', field: 'mask-key', type: 'input' },
                { label: 'Value', field: 'mask-value', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['object']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'flow2.addObjectKey',
    type: 'CallExpression',
    category: "Flow",
    keywords: ['object', 'add', 'key'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to =='context.flow2.addObjectKey'
    },
    getComponent: (node, nodeData, children) => <AddObjectKey node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            object: 'input',
            key: 'input',
            value: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        object: 'input',
        key: 'input',
        value: 'input',
        onDone: { params: {'param-obj': { key: "object"}}},
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.flow2.addObjectKey',
            "mask-object": {
                value: "",
                kind: "Identifier"
            },
            "mask-key": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-value": {
                value: "",
                kind: "Identifier"
            },
            "param-1": {
                value: "{}",
                kind: "Identifier"
            },
        }
    }
}