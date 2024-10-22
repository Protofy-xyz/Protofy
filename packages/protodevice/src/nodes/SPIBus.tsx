import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";

const SPIBus = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        {
            label: 'Bus name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'spi' ? nameErrorMsg : null
        },
        {
            label: 'MOSI Pin', static: true, field: 'param-2', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'MISO Pin', static: true, field: 'param-3', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='SPI Bus' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'SPIBus',
    type: 'CallExpression',
    category: "bus",
    keywords: ["spi", "bus","clk", "mosi", "miso", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('spiBus'),
    getComponent: (node, nodeData, children) => <SPIBus color={getColor('SPIBus')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'spiBus', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "23", kind: "SringLiteral" }, "param-3": { value: "19", kind: "SringLiteral" } } }
}