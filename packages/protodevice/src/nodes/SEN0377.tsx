import React from "react";
import {Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";
const SEN0377 = ({node= {}, nodeData= {}, children, color}: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const intervalErrorMsg = 'Add units h/m/s/ms'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'mics_4514' ? nameErrorMsg : null
        },
        { 
            label: 'Address', static: true, field: 'param-2', type: 'input'
        },
        {
            label: 'i2c bus name', static: true, field: 'param-3', type: 'input',
        },
        {
            label: 'Update Interval', static: true, field: 'param-4', type: 'input',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param-4']?.value?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        },
        
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='SEN0377' color="#12ea41" id={node.id} skipCustom={true} >
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'SEN0377',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["SEN0377", "sensor", "i2c", "device", "air quality", "mics_4514", "nitrogen dioxide", "carbon monoxide", "hydrogen", "ethanol", "methane", "ammonia"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('sen0377'),
    getComponent: (node, nodeData, children) => <SEN0377 color={getColor('SEN0377')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'sen0377', 
        "param-1": { value: "", kind: "StringLiteral" }, 
        "param-2": { value: "0x75", kind: "StringLiteral" },
        "param-3": { value: "", kind: "StringLiteral" },
        "param-4": { value: "60s", kind: "StringLiteral" }
    }}
}