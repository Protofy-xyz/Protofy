import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { TextSelect } from '@tamagui/lucide-icons';

const GetAttributeNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(60)
    return (
        <Node icon={TextSelect} node={node} isPreview={!node.id} title='Get Attribute' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Element', field: 'mask-element', type: 'input' },
                { label: 'Attribute', field: 'mask-attribute', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['value']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'playwright.getAttribute',
    type: 'CallExpression',
    category: "Web Automation",
    keywords: ['get', 'attribute', 'web', 'playwright'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.playwright.getAttribute')
    },
    getComponent: (node, nodeData, children) => <GetAttributeNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            element: 'input',
            attribute: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        element: 'input',
        attribute: 'input',
        onDone: { params: {'param-value': { key: "value"}}},
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.playwright.getAttribute',
            "param-1": {
                value: "{}",
                kind: "Identifier"
            },
            "mask-element": {
                value: "",
                kind: "Identifier"
            },
            "mask-attribute": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}