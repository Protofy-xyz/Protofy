import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";

const RotaryEncoder = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'sensor' ? nameErrorMsg : null
        },
        {
            label: 'B Pin', static: true, field: 'param-2', type: 'select',
            data: ports.filter(port => port.type.includes('IO') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'Reset Pin', static: true, field: 'param-3', type: 'select',
            data: ports.filter(port => port.type.includes('IO') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'Motor name', static: true, field: 'param-4', type: 'input', onBlur: () => { setName(nodeData['param-4']) },
            error: nodeData['param-4']?.value?.replace(/['"]+/g, '') == 'sensor' ? nameErrorMsg : null
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Rotary Encoder' color={color} id={node.id} skipCustom={true} disableOutput={false} output={true}> 
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'RotaryEncoder',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["rotary encoder", "encoder", "cui", "rotary", "offset", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('rotaryEncoder'),
    getComponent: (node, nodeData, children) => <RotaryEncoder color={getColor('RotaryEncoder')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { 
        return { 
            to: 'rotaryEncoder', 
            "param-1": { value: "rotencoder", kind: "StringLiteral" }, 
            "param-2": { value: 23, kind: "NumericLiteral" },
            "param-3": { value: 18, kind: "NumericLiteral" },
            "param-4": { value: "", kind: "StringLiteral" },
            // extra:  { 
            //     to: 'paparrupi', 
            //     "param-1": { value: "new-encoder", kind: "StringLiteral" }, 
            //     "param-2": { value: 23, kind: "NumericLiteral" },
            //     "param-3": { value: 18, kind: "NumericLiteral" },
            // }
        }
    }
}