import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";


const ODriveCan = ({ node = {}, nodeData = {}, children, color }: any) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input',
        },
        {
            label: 'TX Pin', static: true, field: 'param-2', type: 'select',
            data: ports.filter(port => port.type.includes('I') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name.toString())
        },
        {
            label: 'RX Pin', static: true, field: 'param-3', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name.toString())
        },
        {
            label: 'Bit rate', static: true, field: 'param-4', type: 'select',
            data: ['1000', '500', '250', '125', '100', '50', '20', '10', '5', '2.5', '1'].map(rate => rate + 'kbps')
        },
        {
            label: 'ODrive CAN ID', static: true, field: 'param-5', type: 'input',
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='CAN Odrive motor' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'ODriveCan',
    type: 'CallExpression',
    category: "actuators",
    keywords: ["brushless", "motor", "driver", "ODrive", "device", "can"],
    check: (node, nodeData) => {
        console.log("🤖 ~ nodeData:", nodeData)
        return node.type == "CallExpression" && nodeData.to == 'odrivecan'
    },
    getComponent: (node, nodeData, children) => <ODriveCan color={getColor('odrivecan')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'odrivecan', 
        "param-1": { value: "", kind: "StringLiteral" }, 
        "param-2": { value: "", kind: "StringLiteral" },
        "param-3": { value: "", kind: "StringLiteral" },
        "param-4": { value: "500kbps", kind: "StringLiteral" },
        "param-5": { value: 0, kind: "NumericLiteral" }
    }}
}