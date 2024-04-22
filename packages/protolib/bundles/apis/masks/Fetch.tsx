import { Node, NodeParams } from 'protoflow';
import { Plug } from 'lucide-react';

const Fetch = (node: any = {}, nodeData = {}) => {
    return (
        <Node icon={Plug} node={node} isPreview={!node?.id} title='Fetch' id={node.id} color="#A5D6A7" skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Method', field: 'param-1', type: 'select', data: ["get", "post"], static: true }]} />
            <NodeParams id={node.id} params={[{ label: 'Path', field: 'param-2', type: 'input' }]} />
            {
                nodeData["param-1"] == "\"post\"" && <NodeParams id={node.id} params={[{ label: 'Body', field: 'param-5', type: 'input' }]} />
            }
            <NodeParams id={node.id} params={[{ label: 'Data Key', field: 'param-3', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Use admin token', field: 'param-4', type: 'boolean' }]} />
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
    getInitialData: () => {
        return {
            to: 'context.fetch',
            "param-1": { value: "get", kind: "StringLiteral" },
            "param-2": { value: "/api/v1/", kind: "StringLiteral" },
            "param-3": { value: "", kind: "StringLiteral" },
            "param-4": {
                value: false,
                kind: "FalseKeyword"
            },
            "param-5": { value: "", kind: "StringLiteral" },
            await: true
        }
    }
}