import { Node, NodeParams, FlowPort, FallbackPort } from 'protoflow';
import { Send } from '@tamagui/lucide-icons';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme'
import { filterCallback, restoreCallback } from 'protoflow';
import { useEffect, useState } from 'react';
import { API } from 'protobase'

const Fetch = (node: any = {}, nodeData = {}) => {
    const color = useColorFromPalette(20)
    const [endPoints, setEndPoints] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await API.get('/api/v1/endpoints');
            if (response.isLoaded) {
                setEndPoints(response.data.filter((endpoint: any) => endpoint.path !== '/api/v1/endpoints'))
            }
        }
        if(node.id) fetchData()
    }, [])

    return (
        <Node icon={Send} node={node} isPreview={!node?.id} title='Fetch' id={node.id} color={color} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Method', field: 'param-1', type: 'select', data: ["get", "post"] }]} />
            <NodeParams id={node.id} params={[
                {
                    label: 'Target',
                    field: 'param-2',
                    type: 'input',
                    data: { options: endPoints.map(endpoint => endpoint.path) }
                }
            ]} />
            <NodeParams id={node.id} params={[{ label: 'Post Data', field: 'param-3', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Use service token', field: 'param-6', type: 'boolean' }]} />
            <div style={{ marginTop: "120px" }}>
                <FlowPort id={node.id} type='output' label='On Response (data)' style={{ top: '300px' }} handleId={'then'} />
                <FallbackPort fallbackText="null" node={node} port={'param-4'} type={"target"} fallbackPort={'then'} portType={"_"} preText="async (data) => " postText="" />
                <FlowPort id={node.id} type='output' label='On Error (error)' style={{ top: '350px' }} handleId={'error'} />
                <FallbackPort fallbackText="null" node={node} port={'param-5'} type={"target"} fallbackPort={'error'} portType={"_"} preText="async (error) => " postText="" />
            </div>

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
    filterChildren: (node, childScope, edges) => {
        childScope = filterCallback("4", "then")(node, childScope, edges)
        childScope = filterCallback("5", "error")(node, childScope, edges)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("4")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("5")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getComponent: Fetch,
    category: "api",
    keywords: ["api", "rest", "http", "automation", 'fetch', 'get', 'post'],
    getInitialData: () => {
        return {
            to: 'context.fetch',
            "param-1": { value: "get", kind: "StringLiteral" },
            "param-2": { value: "/api/v1/", kind: "StringLiteral" },
            "param-3": { value: "null", kind: "Identifier" },
            "param-4": { value: "null", kind: "Identifier" },
            "param-5": { value: "null", kind: "Identifier" },
            "param-6": { value: "false", kind: "FalseKeyword" }
        }
    }
}