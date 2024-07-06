import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Camera } from 'lucide-react';

const ScreenshotNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(60)  
    return (
        <Node icon={Camera} node={node} isPreview={!node.id} title='Take Screenshot' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Directory', field: 'mask-directory', type: 'input' },
                { label: 'Filename', field: 'mask-filename', type: 'input' },
                { label: 'Full Page', field: 'mask-fullPage', type: 'boolean' },
                { label: 'Page', field: 'mask-page', type: 'input' }
            ]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'playwright.screenshot',
    type: 'CallExpression',
    category: "Web Automation",
    keywords: ['screenshot', 'capture', 'web', 'playwright'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.playwright.screenshot')
    },
    getComponent: (node, nodeData, children) => <ScreenshotNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            directory: 'input',
            filename: 'input',
            fullPage: 'input',
            page: 'input',
            onDone: 'output',
            onError: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        directory: 'input',
        filename: 'input',
        fullPage: 'input',
        page: 'input',
        onDone: { params: {}},  // No parameters passed to onDone
        onError: { params: { 'param-err': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.playwright.screenshot',
            "mask-directory": {
                value: "/",
                kind: "StringLiteral"
            },
            "mask-filename": {
                value: "screenshot",
                kind: "StringLiteral"
            },
            "mask-fullPage": {
                value: true,
                kind: "BooleanLiteral"
            },
            "mask-page": {
                value: "page",
                kind: "Identifier"
            }
        }
    }
}