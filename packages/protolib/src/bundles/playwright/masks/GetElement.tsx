import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { FileBox } from '@tamagui/lucide-icons';

const GetElementNode = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(60)
    return (
        <Node icon={FileBox} node={node} isPreview={!node.id} title={'Get Element'+(nodeData['mask-all']?.value ? 's':'')} color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[
                { label: 'Selector', field: 'mask-selector', type: 'input' },
                { label: 'All', field: 'mask-all', type: 'boolean' },
                { label: 'Page', field: 'mask-page', type: 'input' }
            ]} />
            <div style={{ height: '30px' }} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={[nodeData['mask-all']?.value ? 'elements' : 'element']} handleId={'mask-onDone'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-onError'} />
        </Node>
    )
}

export default {
    id: 'playwright.getElement',
    type: 'CallExpression',
    category: "Web Automation",
    keywords: ['getElement', 'capture', 'web', 'playwright'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.playwright.getElement')
    },
    getComponent: (node, nodeData, children) => <GetElementNode node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({
        keys: {
            selector: 'input',
            all: 'input',
            page: 'input',
            onDone: 'output',
            onError: 'output'
        }
    }),
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges, nodeData) => {
        const name = nodeData && nodeData[node.id] && nodeData[node.id]['mask-all'] && nodeData[node.id]['mask-all'].value ? 'elements' : 'element'
        return restoreObject({
            keys: {
                selector: 'input',
                all: 'input',
                page: 'input',
                onDone: { params: { 'param-x': { key: name } } },
                onError: { params: { 'param-err': { key: "err" } } }
            }
        })(node, nodes, originalNodes, edges, originalEdges, nodeData)
    },
    getInitialData: () => {
        return {
            await: true,
            to: 'context.playwright.getElement',
            "param-1": {
                value: "{}",
                kind: "Identifier"
            },
            "mask-selector": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-all": {
                value: "true",
                kind: "Identifier"
            },
            "mask-page": {
                value: "page",
                kind: "Identifier"
            }
        }
    }
}