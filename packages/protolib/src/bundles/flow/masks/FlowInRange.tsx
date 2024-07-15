import { Node, NodeParams, FlowPort, FallbackPort, getFieldValue } from 'protoflow';
import { useState, useEffect } from 'react';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from '@tamagui/lucide-icons';
import { filterCallback, restoreCallback } from 'protoflow';

const FlowInRange = ({ node = {}, nodeData = {}, children }: any) => {

    const color = useColorFromPalette(11)
    
    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Flow In Range' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Value', field: 'param-1', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Desired value', field: 'param-2', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Threshold (+/-)',  field: 'param-3', type: 'input' }]} />

            <div style={{ marginTop: "250px" }}>
                    <FlowPort id={node.id} type='output' label='above (delta)' style={{ top: '260px' }} handleId={'request'} />
                    <FallbackPort fallbackText="null" node={node} port={'param-4'} type={"target"} fallbackPort={'request'} portType={"_"} preText="async (delta) => " postText="" />
                    <FlowPort id={node.id} type='output' label='below (delta)' style={{ top: '310px' }} handleId={'below'} />
                    <FallbackPort fallbackText="null" node={node} port={'param-5'} type={"target"} fallbackPort={'below'} portType={"_"} preText="async (delta) => " postText="" />
                    <FlowPort id={node.id} type='output' label='range (delta)' style={{ top: '360px' }} handleId={'range'} />
                    <FallbackPort fallbackText="null" node={node} port={'param-6'} type={"target"} fallbackPort={'range'} portType={"_"} preText="async (delta) => " postText="" />
                    <FlowPort id={node.id} type='output' label='error' style={{ top: '410px' }} handleId={'error'} />
                    <FallbackPort fallbackText="null" node={node} port={'param-7'} type={"target"} fallbackPort={'error'} portType={"_"} preText="async () => " postText="" />
            </div>
        </Node>
    )
}
export default {
    id: 'flowInRange',
    type: 'CallExpression',
    category: "Flow",
    keywords: ["control", 'sensor', "feedback loop", "flow","filter"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.flow.inRange')
    },
    getComponent: (node, nodeData, children) => <FlowInRange node={node} nodeData={nodeData} children={children} />,
    filterChildren: (node, childScope, edges)=> {
        childScope = filterCallback("4")(node,childScope,edges)
        childScope = filterCallback("5","below")(node,childScope,edges)
        childScope = filterCallback("6","range")(node,childScope,edges)
        childScope = filterCallback("7","error")(node,childScope,edges)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("4")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("5")(node, result.nodes, originalNodes, result.edges, originalEdges)
        result = restoreCallback("6")(node, result.nodes, originalNodes, result.edges, originalEdges)
        result = restoreCallback("7")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getInitialData: () => {
        return {
            to: 'context.flow.inRange',
            "param-1": {
                value: "",
                kind: "Identifier"
            },
            "param-2": {
                value: 1.5,
                kind: "NumericLiteral"
            },
            "param-3": {
                value: 0.3,
                kind: "NumericLiteral"
            },
            "param-4": {
                value: "null",
                kind: "Identifier"
            },
            "param-5": {
                value: "null",
                kind: "Identifier"
            },
            "param-6": {
                value: "null",
                kind: "Identifier"
            },
            "param-7": {
                value: "null",
                kind: "Identifier"
            }
        }
    }
}
