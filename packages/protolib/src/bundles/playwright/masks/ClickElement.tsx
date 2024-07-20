import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme';
import { Pointer } from '@tamagui/lucide-icons';

const ClickElementNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(60)  // Asegúrate de que el color sea adecuado o cámbialo según la paleta de tu proyecto
    return (
        <Node icon={Pointer} node={node} isPreview={!node.id} title='Click Element' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Element', field: 'mask-element', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'playwright.clickElement',
    type: 'CallExpression',
    category: "Web Automation",
    keywords: ['click', 'element', 'web', 'playwright'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.playwright.clickElement')
    },
    getComponent: (node, nodeData, children) => <ClickElementNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            element: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        element: 'input',
        onDone: { params: {}},  // No parameters are passed to onDone
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.playwright.clickElement',
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