import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { FileText } from 'lucide-react';

const ToJSON = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(40)
    return (
        <Node icon={FileText} node={node} isPreview={!node.id} title='Convert to JSON' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Value', field: 'mask-value', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['json']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'flow2.toJson',
    type: 'CallExpression',
    category: "Flow",
    keywords: ['json', 'dump', 'data'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to =='context.flow2.toJson'
    },
    getComponent: (node, nodeData, children) => <ToJSON node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            value: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        value: 'input',
        onDone: { params: {'param-json': { key: "json"}}},
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.flow2.toJson',
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