import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Compass } from '@tamagui/lucide-icons';

const NavigateNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(60)
    return (
        <Node icon={Compass} node={node} isPreview={!node.id} title='Navigate URL' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Address (URL)', field: 'mask-url', type: 'input' },
                { label: 'Page', field: 'mask-page', type: 'input' }  // Assuming 'Page' can be passed as an input in your workflow
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'playwright.navigate',
    type: 'CallExpression',
    category: "Web Automation",
    keywords: ['navigate', 'url', 'web', 'playwright'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.playwright.navigate')
    },
    getComponent: (node, nodeData, children) => <NavigateNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            url: 'input',
            page: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        url: 'input',
        page: 'input',
        onDone: { params: {}},  // No parameters passed to onDone
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.playwright.navigate',
            "mask-url": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-page": {
                value: "page",
                kind: "Identifier"
            }
        }
    }
}