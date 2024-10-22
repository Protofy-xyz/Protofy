import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";

const UARTBus = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        {
            label: 'Bus name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'uart' ? nameErrorMsg : null
        },
        {
            label: 'RX Pin', static: true, field: 'param-2', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name.toString())
        },
        {
            label: 'Baud rate', static: true, field: 'param-3', type: 'input',
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='UART Bus' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'UARTBus',
    type: 'CallExpression',
    category: "bus",
    keywords: ["uart","serial", "bus","tx", "rx", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('uartBus'),
    getComponent: (node, nodeData, children) => <UARTBus color={getColor('UARTBus')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'uartBus', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "17", kind: "StringLiteral" }, "param-3": { value: "9600", kind: "StringLiteral" } } }
}