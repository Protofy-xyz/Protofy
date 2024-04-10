import React from "react";
import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";
// import { Node, Field, HandleOutput, NodeParams } from '../../flowslib';
// import { pinTable } from '../../../lib/device/Device'

const TempHumidity = ({ node = {}, nodeData = {}, children, color }: any) => {
    const transitionErrorMsg = 'Add units s/ms'

    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param-1', type: 'input' },
        {
            label: 'Model', static: true, field: 'param-2', type: 'select',
            data: ["DHT11", "DHT22", "DHT22_TYPE2", "AM2302", "RHT03", "SI7021"]
        },
        {
            label: 'Update Interval', static: true, field: 'param-3', type: 'input',
            error: !['s', 'ms'].includes(nodeData['param-3']?.value?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Temperature & Humidity' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'Temp&Humidity',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["temperature", "humidity","sensor", "onewire","dht11","dht22","SI7021","RHT03","AM2302", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('tempHumidity'),
    getComponent: (node, nodeData, children) => <TempHumidity color={getColor('TempHumidity')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'tempHumidity', "param-1": { value: "temperaturehumidity", kind: "StringLiteral" }, "param-2": { value: "DHT22", kind: "StringLiteral" }, "param-3": { value: "60s", kind: "StringLiteral" } } }
}
