import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { FileText } from 'lucide-react';

const JsonParseNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(40)
    return (
        <Node icon={FileText} node={node} isPreview={!node.id} title='JSON Parse' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'JSON Data', field: 'mask-data', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['result']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'flow2.jsonParse',
    type: 'CallExpression',
    category: "Flow",
    keywords: ['json', 'parse', 'data'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.flow2.jsonParse')
    },
    getComponent: (node, nodeData, children) => <JsonParseNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            data: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        data: 'input',
        onDone: { params: {'param-result': { key: "result"}}},
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.flow2.jsonParse',
            "mask-data": {
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