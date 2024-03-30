import { Node, NodeParams } from 'protoflow';
import { Plug } from 'lucide-react';

const Fetch = (node: any = {}, nodeData = {}) => {
    return (
        <Node icon={Plug} node={node} isPreview={!node?.id} title='Fetch' id={node.id} color="#A5D6A7" skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Method', field: 'param1', type: 'select', data: ["\"get\"", "\"post\""], static: true }]} />
            <NodeParams id={node.id} params={[{ label: 'Path', field: 'param2', type: 'input' }]} />
            {
                nodeData?.param1 == "\"post\"" && <NodeParams id={node.id} params={[{ label: 'Body', field: 'param5', type: 'input' }]} />
            }
            <NodeParams id={node.id} params={[{ label: 'Data Key', field: 'param3', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Use admin token', field: 'param4', type: 'boolean' }]} />
        </Node>
    )
}

export default {
    id: 'Fetch',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && (nodeData.to == 'context.fetch')
        )
    },
    getComponent: Fetch,
    category: "api",
    keywords: ["api", "rest", "http", "automation", 'fetch', 'get', 'post'],
    getInitialData: () => { return { to: 'context.fetch', param1: "\"get\"", param2: '"/api/v1/"', param3: "", param4: false, param5: "", await: true } }
}