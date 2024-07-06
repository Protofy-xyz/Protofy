import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { NavigationIcon } from 'lucide-react';

const GetBrowserNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(60)
    return (
        <Node icon={NavigationIcon} node={node} isPreview={!node.id} title='Get Browser' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Browser type', field: 'mask-browserType', type: 'select', data: ["chromium", "firefox", "webkit"] }]} />
            <NodeParams id={node.id} params={[{ label: 'Visible', field: 'mask-visible', type: 'boolean' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['browser', 'page']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'playwright.getBrowser',
    type: 'CallExpression',
    category: "Web Automation",
    keywords: ['get', 'browser', 'automation'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.playwright.getBrowser')
    },
    getComponent: (node, nodeData, children) => <GetBrowserNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            browserType: 'input',
            visible: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        browserType: 'input',
        visible: 'input',
        onDone: { params: {'param-browser': { key: "browser"}, 'param-page': { key: "page"}}},
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.playwright.getBrowser',
            "param-1": {
                value: "{}",
                kind: "Identifier"
            },
            "mask-visible": { 
                value: "true", 
                kind: "FalseKeyword"
            },
            "mask-browserType": {
                value: "chromium",
                kind: "StringLiteral"
            }
        }
    }
}