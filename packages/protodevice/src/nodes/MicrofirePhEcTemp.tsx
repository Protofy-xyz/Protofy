import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";

const MicrofirePhEcTemp = ({ node = {}, nodeData = {}, children, color }: any) => {
    const transitionErrorMsg = 'Add units s/ms'
    const intervalErrorMsg = 'Add units h/m/s/ms'
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param-1', type: 'input' },
        {
            label: 'Scl Pin', static: true, field: 'param-2', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'Update Interval', static: true, field: 'param-3', type: 'input',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param-3']?.value?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='pH & EC & WaterTemp Microfire' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'MicrofirePhEcTemp',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["i2c","microfire", "ec", "ph", "temperature","water", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('microfirePhEcTemp'),
    getComponent: (node, nodeData, children) => <MicrofirePhEcTemp color={getColor('MicrofirePhEcTemp')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'microfirePhEcTemp', "param-1": { value: "phectemp", kind: "StringLiteral" }, "param-2": { value: 22, kind: "NumericLiteral" }, "param-3": { value: "60s", kind: "StringLiteral" } } }
}
