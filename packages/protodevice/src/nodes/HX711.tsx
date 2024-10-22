import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";

const HX711 = ({ node = {}, nodeData = {}, children, color }: any) => {
    const transitionErrorMsg = 'Add units s/ms'
    const nameErrorMsg = 'Reserved name'
    const [name, setName] = React.useState(nodeData['param-1'])
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'hx711' ? nameErrorMsg : null
        }, {
            label: 'CLK Pin', static: true, field: 'param-2', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        { label: 'Gain', static: true, field: 'param-3', type: 'input' },
        {
            label: 'Update Interval', static: true, field: 'param-4', type: 'input',
            error: !['s', 'ms'].includes(nodeData['param-4']?.value?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='HX711 Load Cell' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'HX711',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["analog", "cell","hx711", "load", "bridge", "wheatstone", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('hx711'),
    getComponent: (node, nodeData, children) => <HX711 color={getColor('HX711')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'hx711', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" }, "param-3": { value: "128", kind: "StringLiteral" }, "param-4": { value: "60s", kind: "StringLiteral" } } }
}
