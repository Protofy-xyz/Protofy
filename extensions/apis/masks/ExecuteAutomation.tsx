import { Node, NodeParams, FlowPort, FallbackPort } from 'protoflow';
import { Send } from '@tamagui/lucide-icons';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { filterCallback, restoreCallback } from 'protoflow';
import { useEffect, useState } from 'react';
import { API } from 'protobase'

const ExecuteAutomation = (node: any = {}, nodeData = {}) => {
    const color = useColorFromPalette(20)
    const [endPoints, setEndPoints] = useState<any[]>([]);
    let allEndPoints = []
    useEffect(() => {
        const fetchData = async () => {
            const response = await API.get('/api/v1/endpoints');
            if (response.isLoaded) {
                allEndPoints =[ ...allEndPoints,
                    ...response.data
                      .filter((endpoint: any) => endpoint.path.startsWith('/api/v1/automations'))
                      .map((endpoint: any) => endpoint.path)
                ]
            }
            const pythonResponse = await API.get('/pyapi/v1/endpoints');
            if (pythonResponse.isLoaded) {
                allEndPoints = [ ...allEndPoints,
                    ...pythonResponse.data
                      .filter((endpoint: any) => endpoint.path.startsWith('/pyapi/v1/automations'))
                      .map((endpoint: any) => endpoint.path)
                ]
            }
            setEndPoints(allEndPoints)
        }
        if(node.id) fetchData()
    }, [])

    return (
        <Node icon={Send} node={node} isPreview={!node?.id} title='Run Automation' id={node.id} color={color} skipCustom={true}>
            <NodeParams id={node.id} params={[
                {
                    label: 'Target',
                    field: 'param-1',
                    type: 'input',
                    data: { options: endPoints.map(endpoint => endpoint) }
                }
            ]} />
            
            <NodeParams id={node.id} params={[{ label: 'Params[string]', field: 'param-5', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Use service token', field: 'param-4', type: 'boolean' }]} />
            <div style={{ marginTop: "200px" }}>
                <FlowPort id={node.id} type='output' label='On Response (data)' style={{ top: '240px' }} handleId={'then'} />
                <FallbackPort fallbackText="null" node={node} port={'param-2'} type={"target"} fallbackPort={'then'} portType={"_"} preText="async (data) => " postText="" />
                <FlowPort id={node.id} type='output' label='On Error (error)' style={{ top: '290px' }} handleId={'error'} />
                <FallbackPort fallbackText="null" node={node} port={'param-3'} type={"target"} fallbackPort={'error'} portType={"_"} preText="async (error) => " postText="" />
            </div>

        </Node>
    )
}

export default {
    id: 'ExecuteAutomation',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && (nodeData.to == 'context.executeAutomation')
        )
    },
    filterChildren: (node, childScope, edges) => {
        childScope = filterCallback("2", "then")(node, childScope, edges)
        childScope = filterCallback("3", "error")(node, childScope, edges)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("2")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("3")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getComponent: ExecuteAutomation,
    category: "api",
    keywords: ["api", "rest", "http", "automation", 'fetch', 'get', 'execute', "run"],
    getInitialData: () => {
        return {
            to: 'context.executeAutomation',
            "param-1": { value: "", kind: "StringLiteral" },
            "param-2": { value: "null", kind: "Identifier" },
            "param-3": { value: "null", kind: "Identifier" },
            "param-4": { value: "false", kind: "FalseKeyword" },
            "param-5": { value: "", kind: "StringLiteral"}
        }
    }
}