import React from "react";
import {Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";
    

const I2c_MCP23008 = ({node= {}, nodeData= {}, children, color}: any) => {
    const [name,setName] = React.useState(nodeData['param1'])
    const [pins,setPins] = React.useState(Array.from({ length: 8 }, (_, i) => {
        return {label: `Config pin ${i}:`, static: true, field: 'param-'+(i+4), type: 'select', data:["input", "output"] }
    }));
    const nameErrorMsg = 'Reserved name'
    const intervalErrorMsg = 'Add units h/m/s/ms'
    
    console.log('pins', pins)

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
        ...pins
        // {
        //     label: 'Scan', static: true, field: 'param-4', type: 'boolean',
        //     // error: !['h', 'm', 's', 'ms'].includes(nodeData['param-4']?.value?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        // }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='MCP23008' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    ) 
}

export default {
    id: 'I2c_MCP23008',
    type: 'CallExpression',
    category: "hybrid",
    keywords: ["expansor", "MCP23008", "switch","binary_sensor", "input", "output","i2c", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('i2c_MCP23008'),
    getComponent: (node, nodeData, children) => <I2c_MCP23008 color={getColor('I2c_MCP23008')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { 
        const defaultPins = {}
        Array.from({ length: 8 }, (_, i) => {
            defaultPins["param-"+(i+4)] = { value: "output", kind: "StringLiteral" }
            return defaultPins
        })
        return { 
        to: 'i2c_MCP23008', 
        "param-1": { value: "", kind: "StringLiteral" }, 
        "param-2": { value: "0x20", kind: "StringLiteral" }, 
        "param-3": { value: "", kind: "StringLiteral" },
        ...defaultPins
        }
    }
}