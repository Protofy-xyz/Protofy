import { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";

const EthernetRmii = ({ node = {}, nodeData = {}, children, color }: any) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        {
            label: 'Type', static: true, field: 'param-1', type: 'select',
            data: ["LAN8720", "RTL8201", "DP83848", "IP101", "JL1101", "KSZ8081", "KSZ8081RNA"]
        },
        {
            label: 'MDC Pin', static: true, field: 'param-2', type: 'select',
            data: ports.filter(port => port.type.includes('IO') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'MDIO Pin', static: true, field: 'param-3', type: 'select',
            data: ports.filter(port => port.type.includes('IO') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'Clk mode', static: true, field: 'param-4', type: 'select',
            data: ["GPIO0_IN", "GPIO0_OUT", "GPIO16_OUT", "GPIO17_OUT"]
        },
        {
            label: 'Phy address', static: true, field: 'param-5', type: 'input'
        },
        {
            label: 'Power Pin', static: true, field: 'param-6', type: 'select',
            data: ["none"].concat(ports.filter(port => port.type.includes('IO') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name))
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Ethernet (RMII)' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'EthernetRmii',
    type: 'CallExpression',
    category: "connectivity",
    keywords: ["ethernet", "bus","tcp", "udp","internet", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ethernetRmii'),
    getComponent: (node, nodeData, children) => <EthernetRmii color={getColor('EthernetRmii')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { 
        to: 'ethernetRmii', 
        "param-1": { value: "LAN8720", kind: "StringLiteral" }, 
        "param-2": { value: 23, kind: "NumericLiteral" }, 
        "param-3": { value: 18, kind: "NumericLiteral" }, 
        "param-4": { value: "GPIO17_OUT", kind: "StringLiteral" },
        "param-5": { value: 0, kind: "NumericLiteral" }, 
        "param-6": { value: 12, kind: "NumericLiteral" } 
    } }
}