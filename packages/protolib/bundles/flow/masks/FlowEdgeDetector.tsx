import { Node, NodeParams, FlowPort, FallbackPort, getFieldValue } from 'protoflow';
import { useState, useEffect } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { filterCallback, restoreCallback } from 'protoflow';
import { v4 as uuidv4 } from 'uuid';

const FlowEdgeDetector = ({ node = {}, nodeData = {}, children }: any) => {

    const color = useColorFromPalette(12)
    
    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Flow Edge Detector' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Value', field: 'param-1', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'High value', field: 'param-2', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Low value',  field: 'param-3', type: 'input' }]} />

            <div style={{ marginTop: "150px" }}>
                    <FlowPort id={node.id} type='output' label='rising (value)' style={{ top: '260px' }} handleId={'rising'} />
                    <FallbackPort fallbackText="null" node={node} port={'param-5'} type={"target"} fallbackPort={'rising'} portType={"_"} preText="async (value) => " postText="" />
                    <FlowPort id={node.id} type='output' label='falling (value)' style={{ top: '310px' }} handleId={'falling'} />
                    <FallbackPort fallbackText="null" node={node} port={'param-6'} type={"target"} fallbackPort={'falling'} portType={"_"} preText="async (value) => " postText="" />
            </div>
        </Node>
    )
}
export default {
    id: 'flowEdgeDetector',
    type: 'CallExpression',
    category: "Flow",
    keywords: ['sensor', "edge","rifing","rise","falling", "fall" ,"flow","filter"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.flow.edgeDetector')
    },
    getComponent: (node, nodeData, children) => <FlowEdgeDetector node={node} nodeData={nodeData} children={children} />,
    filterChildren: (node, childScope, edges)=> {
        childScope = filterCallback("5","rising")(node,childScope,edges)
        childScope = filterCallback("6","falling")(node,childScope,edges)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("5")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("6")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getInitialData: () => {
        return {
            to: 'context.flow.edgeDetector',
            "param-1": {
                value: "",
                kind: "Identifier"
            },
            "param-2": {
                value: "ON",
                kind: "StringLiteral"
            },
            "param-3": {
                value: "OFF",
                kind: "StringLiteral"
            },
            "param-4": {
                value: uuidv4(),
                kind: "StringLiteral"
            },
            "param-5": {
                value: "null",
                kind: "Identifier"
            },
            "param-6": {
                value: "null",
                kind: "Identifier"
            }
        }
    }
}
