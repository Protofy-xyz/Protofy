import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme';
import { X } from '@tamagui/lucide-icons';

const Close = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(60)
    return (
        <Node icon={X} node={node} isPreview={!node.id} title='End Browser Session' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'browser', field: 'mask-browser', type: 'input' }  // Assuming 'Page' can be passed as an input in your workflow
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'playwright.close',
    type: 'CallExpression',
    category: "Web Automation",
    keywords: ['close', 'url', 'web', 'playwright'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.playwright.close')
    },
    getComponent: (node, nodeData, children) => <Close node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            browser: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        browser: 'input',
        onDone: { params: {}},  // No parameters passed to onDone
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.playwright.close',
            "param-1": {
                value: "{}",
                kind: "Identifier"
            },
            "mask-browser": {
                value: "browser",
                kind: "Identifier"
            }
        }
    }
}