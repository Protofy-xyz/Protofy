import { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from '.';

const Modem = ({ node = {}, nodeData = {}, children, color }: any) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports

    const nodeParams: Field[] = [
        {
            label: 'RX Pin', static: true, field: 'param-1', type: 'select',
            data: ["11", "13", "14", ...ports.filter(port => port.type.includes('I')).map(port => port.name.toString())]
        },
        {
            label: 'TX Pin', static: true, field: 'param-2', type: 'select',
            data: ["11", "13", "14", ...ports.filter(port => port.type.includes('O')).map(port => port.name.toString())]
        },
        {
            label: 'Power Pin', static: true, field: 'param-3', type: 'select',
            data: ["11", "13", "14", ...ports.filter(port => port.type.includes('O')).map(port => port.name.toString())]
        },
        {
            label: 'Model', static: true, field: 'param-4', type: 'select',
            data: [
                { value: "BG96", label: "BG96" },
                { value: "SIM7000", label: "SIM7000" },
                { value: "SIM800", label: "SIM800" },
                { value: "GENERIC", label: "GENERIC" }
            ]
        },
        {
            label: 'APN', static: true, field: 'param-5', type: 'input',
        },
        {
            label: 'PIN Code', static: true, field: 'param-6', type: 'text',
        },
        {
            label: 'Enable CMUX', static: true, field: 'param-7', type: 'boolean'
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Modem' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'Modem',
    type: 'CallExpression',
    category: "connectivity",
    keywords: ["modem", "bus","tcp", "udp", "ssid","internet", "device", "network", "mqtt", "wifi", "gsm", "lte", "4g", "5g", "sim"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('modem'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <Modem color={getColor('Modem')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'modem', 
        "param-1": { value: "13", kind: "StringLiteral" }, 
        "param-2": { value: "14", kind: "StringLiteral" },
        "param-3": { value: "11", kind: "StringLiteral" },
        "param-4": { value: "BG96", kind: "StringLiteral" },
        "param-5": { value: "em", kind: "StringLiteral" },
        "param-6": { value: "", kind: "StringLiteral" },
        "param-7": { value: true, kind: "BooleanLiteral" }
    } }
}
