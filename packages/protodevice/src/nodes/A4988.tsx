import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";

const A4988 = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const intervalErrorMsg = 'Add units steps/s'
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'stepper' ? nameErrorMsg : null
        },
        {
            label: 'Dir Pin', static: true, field: 'param-2', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'Max speed', static: true, field: 'param-3', type: 'input',
            error: ![' steps/s'].includes(nodeData['param-3']?.value?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        },
        {
            label: 'Sleep Pin', static: true, field: 'param-4', type: 'select',
            data: ["none"].concat(ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name))
        },
        {
            label: 'Acceleration', static: true, field: 'param-5', type: 'input',
        },
        {
            label: 'Deceleration', static: true, field: 'param-6', type: 'input',
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='A4988 Stepper driver' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'A4988',
    type: 'CallExpression',
    category: "actuators",
    keywords: ["stepper", "motor","driver", "A4988", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('a4988'),
    getComponent: (node, nodeData, children) => <A4988 color={getColor('A4988')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'a4988', 
    "param-1": { value: "", kind: "StringLiteral" }, 
    "param-2": { value: "30s", kind: "StringLiteral" },
    "param-3": { value: "250 steps/s", kind: "StringLiteral" }, 
    "param-4": { value: "none", kind: "StringLiteral" }, 
    "param-5": { value: "inf", kind: "StringLiteral" }, 
    "param-6": { value: "inf", kind: "StringLiteral" }}}
}