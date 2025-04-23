import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";

const CANBusSPI = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        {
            label: 'Bus name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'canbus' ? nameErrorMsg : null
        },
        {
            label: 'SPI bus name', static: true, field: 'param-2', type: 'input', onBlur: () => { setName(nodeData['param-2']) },
            error: nodeData['param-2']?.value?.replace(/['"]+/g, '') == 'spi' ? nameErrorMsg : null
        },
        {
            label: 'CS Pin', static: true, field: 'param-3', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'Default can send ID', static: true, field: 'param-4', type: 'input'
        },
        {
            label: 'Bit rate', static: true, field: 'param-5', type: 'select',
            data: ['1000', '500', '250', '125', '100', '50', '20', '10', '5', '2.5', '1'].map(rate => rate + 'kbps')
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='CAN Bus SPI' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'CANBusSPI',
    type: 'CallExpression',
    category: "bus",
    keywords: ["can", "bus", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('canBusSPI'),
    getComponent: (node, nodeData, children) => <CANBusSPI color={getColor('CANBusSPI')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'canBusSPI', 
        "param-1": { value: "", kind: "StringLiteral" }, 
        "param-2": { value: "", kind: "StringLiteral" }, 
        "param-3": { value: "", kind: "StringLiteral" },
        "param-4": { value: 680, kind: "NumericLiteral" },
        "param-5": { value: "125kbps", kind: "StringLiteral" }
    } }
}