import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";

const I2cBus = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const nodeParams: Field[] = [
        {
            label: 'Bus name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'i2c' ? nameErrorMsg : null
        },
        {
            label: 'Scl Pin', static: true, field: 'param-2', type: 'select',
            data: ports.filter(port => port.type.includes('O') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)
        },
        {
            label: 'Scan', static: true, field: 'param-3', type: 'boolean',
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='i2c Bus' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'I2cBus',
    type: 'CallExpression',
    category: "bus",
    keywords: ["i2c", "bus","sda", "scl", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('i2cBus'),
    getComponent: (node, nodeData, children) => <I2cBus color={getColor('I2cBus')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'i2cBus', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "22", kind: "StringLiteral" }, "param-3": { value: true, kind: "FalseKeyword" } } }
}