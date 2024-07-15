import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Pointer } from '@tamagui/lucide-icons';

const InnerHTMLNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(60)  // Asegúrate de que el color sea adecuado o cámbialo según la paleta de tu proyecto
    return (
        <Node icon={Pointer} node={node} isPreview={!node.id} title='innerHTML' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Element', field: 'mask-element', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['html']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'playwright.innerHTML',
    type: 'CallExpression',
    category: "Web Automation",
    keywords: ['innerHTML', 'element', 'web', 'playwright'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.playwright.innerHTML')
    },
    getComponent: (node, nodeData, children) => <InnerHTMLNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            element: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        element: 'input',
        onDone: { params: {'param-html': {key: "html"}}},  // No parameters are passed to onDone
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.playwright.innerHTML',
            "param-1": {
                value: "{}",
                kind: "Identifier"
            },
            "mask-element": {
                value: "",
                kind: "Identifier"
            }
        }
    }
}