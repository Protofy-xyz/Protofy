import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from '.';


const UltrasonicDistanceSensor = ({ node = {}, nodeData = {}, children, color }: any) => {
    const transitionErrorMsg = 'Add units s/ms'
    const nameErrorMsg = 'Reserved name'
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const ports = metadata.board.ports

    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input',
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'ultrasonic' ? nameErrorMsg : null
        },       {
            label: 'ECHO Pin', static: true, field: 'param-2', type: 'select',
            data: ports.filter(port => port.type.includes('I') && !['EN', '36', '39', 'CLK', 'TX', 'RX'].includes(port.name)).map(port => port.name.toString())
        },
        {
            label: 'Update Interval', static: true, field: 'param-3', type: 'input',
            error: !['s', 'ms'].includes(nodeData['param-3']?.value?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Ultrasonic Distance Sensor' color="#EF9A9A" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'UltrasonicDistanceSensor',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["ultrasonic","hc-sr04", "distance"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ultrasonicDistanceSensor'),
    getComponent: (node, nodeData, children) => <UltrasonicDistanceSensor color={getColor('UltrasonicDistanceSensor')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'ultrasonicDistanceSensor', 
        "param-1": { value: "ultrasonicsensor", kind: "StringLiteral" }, 
        "param-2": { value: "", kind: "StringLiteral" }, 
        "param-3": { value: "5s", kind: "StringLiteral" },
    } }
}