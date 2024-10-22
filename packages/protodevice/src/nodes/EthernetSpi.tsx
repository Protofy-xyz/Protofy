import { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";

const EthernetSpi = ({ node = {}, nodeData = {}, children, color }: any) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        {
            label: 'Type', static: true, field: 'param-1', type: 'select',
            data: ["W5500"]
        },
        {
            label: 'MOSI Pin', static: true, field: 'param-2', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'MISO Pin', static: true, field: 'param-3', type: 'select',
            data: ports.filter(port => port.type.includes('I') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'SCK Pin', static: true, field: 'param-4', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'CS Pin', static: true, field: 'param-5', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'Interrupt Pin', static: true, field: 'param-6', type: 'select',
            data: ports.filter(port => port.type.includes('IO') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name).concat(['None'])
        },
        {
            label: 'Reset Pin', static: true, field: 'param-7', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name).concat(['None'])
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Ethernet (SPI)' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'EthernetSpi',
    type: 'CallExpression',
    category: "connectivity",
    keywords: ["ethernet", "bus","tcp", "udp","internet", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ethernetSpi'),
    getComponent: (node, nodeData, children) => <EthernetSpi color={getColor('EthernetSpi')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { 
        to: 'ethernetSpi', 
        "param-1": { value: "W5500", kind: "StringLiteral" }, 
        "param-2": { value: 23, kind: "NumericLiteral" }, 
        "param-3": { value: 19, kind: "NumericLiteral" }, 
        "param-4": { value: 18, kind: "NumericLiteral" },
        "param-5": { value: "", kind: "NumericLiteral" }, 
        "param-6": { value: "None", kind: "StringLiteral" },
        "param-7": { value: "None", kind: "StringLiteral" }
    } }
}