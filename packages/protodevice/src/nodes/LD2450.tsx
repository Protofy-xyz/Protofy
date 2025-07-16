import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";


const LD2450 = ({ node = {}, nodeData = {}, children, color }: any) => {
    const transitionErrorMsg = 'Add units s/ms'
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input',
        },
        {
            label: 'RX Pin', static: true, field: 'param-2', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name.toString())
        },
        {
            label: 'Update Interval', static: true, field: 'param-3', type: 'input',
            error: !['s', 'ms'].includes(nodeData['param-3']?.value?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='LD2450 Sensor' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'LD2450',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["ld2450", "sensor", "device", "distance", "radar", "mmwave", "presence"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to == 'ld2450'
    },
    getComponent: (node, nodeData, children) => <LD2450 color={getColor('ld2450')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'ld2450', 
        "param-1": { value: "", kind: "StringLiteral" }, 
        "param-2": { value: "", kind: "StringLiteral" },
        "param-3": { value: "", kind: "StringLiteral" },
    }}
}