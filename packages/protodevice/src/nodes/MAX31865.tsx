import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext} from 'protoflow';
import { getColor } from ".";
/*
# Example configuration entry
sensor:
  - platform: max31865
    name: "living_room_temp"
    id: "living_room_temp"
    spi_id: "myspibus"
    cs_pin: 16
    reference_resistance: 430 Ω
    rtd_nominal_resistance: 100 Ω
    rtd_wires: 3
    update_interval: 5s
*/
const MAX31865 = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports
    const transitionErrorMsg = 'Add units s/ms'
    const ohmsErrorMsg = 'Add units Ω'
    const nameErrorMsg = 'Reserved name'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'dallas' ? nameErrorMsg : null
        },
        {
            label: 'SPI Bus Name', static: true, field: 'param-2', type: 'input'
        },
        {
            label: 'CS PIN', static: true, field: 'param-3', type: 'select',
            data: ports.filter(port => port.type.includes('IO') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name)

        },
        {
            label: 'Reference Resistance', static: true, field: 'param-4', type: 'input',
            error: !nodeData['param-4']?.value?.includes('Ω') ? ohmsErrorMsg : null
        },
        {
            label: 'RTD Nominal Resistance', static: true, field: 'param-5', type: 'input',
            error: !nodeData['param-5']?.value?.includes('Ω') ? ohmsErrorMsg : null
        },
        {
            label: 'RTD Wires', static: true, field: 'param-6', type: 'select',
            data: ['2', '3', '4']
        },
        {
            label: 'Update Interval', static: true, field: 'param-7', type: 'input',
            error: !['s', 'ms'].includes(nodeData['param-7']?.value?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        }
    ] as Field[]

    return (
        <Node node={node} isPreview={!node.id} title='MAX31865' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'MAX31865',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["spi", "temperature", "max31865", "pt100", "pt1000", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('max31865'),
    getComponent: (node, nodeData, children) => <MAX31865 color={getColor('MAX31865')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { 
        return { 
            to: 'max31865', 
            "param-1": { value: "tempsensor", kind: "StringLiteral" },
            "param-2": { value: "myspibus", kind: "StringLiteral" },
            "param-3": { value: "", kind: "NumericLiteral" },
            "param-4": { value: "430 Ω", kind: "StringLiteral" },
            "param-5": { value: "100 Ω", kind: "StringLiteral" },
            "param-6": { value: "3", kind: "StringLiteral" },
            "param-7": { value: "5s", kind: "StringLiteral" }
        } 
    }
}