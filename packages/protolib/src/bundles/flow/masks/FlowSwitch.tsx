import { Node, FlowPort, FallbackPort, NodeParams } from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme'
import { Cable } from '@tamagui/lucide-icons';
import { filterCallback, restoreCallback } from 'protoflow';
import {operations} from '../context/flowSwitch'

const FlowSwitch = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(10)
    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Flow Switch' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Value 1', field: 'param-1', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Type', field: 'param-3', type: 'select', data: operations, static: true }]} />
            <NodeParams id={node.id} params={[{ label: 'Value 2', field: 'param-2', type: 'input' }]} />

            <div style={{ marginTop: "180px" }}>
                <FlowPort id={node.id} type='output' label='then' style={{ top: '250px' }} handleId={'then'} />
                <FallbackPort fallbackText="null" node={node} port={'param-4'} type={"target"} fallbackPort={'then'} portType={"_"} preText="async () => " postText="" />
                <FlowPort id={node.id} type='output' label='else' style={{ top: '300px' }} handleId={'else'} />
                <FallbackPort fallbackText="null" node={node} port={'param-5'} type={"target"} fallbackPort={'else'} portType={"_"} preText="async () => " postText="" />
                <FlowPort id={node.id} type='output' label='error' style={{ top: '350px' }} handleId={'error'} />
                <FallbackPort fallbackText="null" node={node} port={'param-6'} type={"target"} fallbackPort={'error'} portType={"_"} preText="async () => " postText="" />
            </div>
        </Node>
    )
}
export default {
    id: 'flowSwitch',
    type: 'CallExpression',
    category: "Flow",
    keywords: ["control", "filter", "switch", "flow", "conditional"],
    hidden: true,
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.flow.switch')
    },
    getComponent: (node, nodeData, children) => <FlowSwitch node={node} nodeData={nodeData} children={children} />,
    filterChildren: (node, childScope, edges)=> {
        childScope = filterCallback("4", "then")(node,childScope,edges)
        childScope = filterCallback("5", "else")(node,childScope,edges)
        childScope = filterCallback("6","error")(node,childScope,edges)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("4")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("5")(node, result.nodes, originalNodes, result.edges, originalEdges)
        result = restoreCallback("6")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getInitialData: () => {
        return {
            to: 'context.flow.switch',
            "param-1": {
                value: "",
                kind: "Identifier"
            },
            "param-2": {
                value: "",
                kind: "Identifier"
            },
            "param-3": {
                value: "equals",
                kind: "StringLiteral"
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
            }
        }
    }
}
