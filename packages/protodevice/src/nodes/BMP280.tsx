import React from "react";
import {Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";

const BMP280 = ({node= {}, nodeData= {}, children, color}: any) => {
    const [name,setName] = React.useState(nodeData['param1'])
    const nameErrorMsg = 'Reserved name'
    const intervalErrorMsg = 'Add units h/m/s/ms'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur:()=>{setName(nodeData['param1'])},
            error: nodeData['param1']?.replace(/['"]+/g, '') == 'i2c' ? nameErrorMsg : null
        },
        {
            label: 'Address', static: true, field: 'param-2', type: 'input', 
        },
        {
            label: 'i2c bus name', static: true, field: 'param-3', type: 'input', 
        },
        {
            label: 'Update Interval', static: true, field: 'param-4', type: 'input',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param-4']?.value?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        },
        {
            label: 'oversampling', static: true, field: 'param-5', type: 'input', 
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='BMP280' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    ) 
}

export default {
    id: 'BMP280',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["BMP280", "pressure", "sensor", "temperature","i2c", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('bmp280'),
    getComponent: (node, nodeData, children) => <BMP280 color={getColor('BMP280')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'bmp280', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "0x77", kind: "StringLiteral" }, "param-3": { value: "", kind: "StringLiteral" }, "param-4": { value: "60s", kind: "StringLiteral" } , "param-5": { value: "16x", kind: "StringLiteral" }} }
}