import React from "react";
import {Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";

const INA226 = ({node= {}, nodeData= {}, children, color}: any) => {
    const [name,setName] = React.useState(nodeData['param1'])

    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur:()=>{setName(nodeData['param1'])},
            error: nodeData['param1']?.replace(/['"]+/g, '') == 'i2c' ? 'Reserved name' : null
        },
        {
            label: 'Address', static: true, field: 'param-2', type: 'input', 
        },
        {
            label: 'i2c bus name', static: true, field: 'param-3', type: 'input', 
        },
        {
            label: 'Shunt resistance', static: true, field: 'param-4', type: 'input', 
            error: !['ohm'].includes(nodeData['param-4']?.value?.replace(/['."0-9]+/g, '')) ? 'Add units ohm' : null

        },
        {
            label: 'Max current', static: true, field: 'param-5', type: 'input',
            error: !['A'].includes(nodeData['param-5']?.value?.replace(/['."0-9]+/g, '')) ? 'Add units A' : null
        },
        {
            label: 'Adc sampling time', static: true, field: 'param-6', type: 'select', 
            data: ["140us", "204us", "332us", "588us", "1100us", "2116us", "4156us", "8244us"]
        },
        {
            label: 'Adc averaging samples', static: true, field: 'param-7', type: 'select',
            data: [ "1", "4", "16", "64", "128", "256", "512", "1024"] 
        },
        {
            label: 'Update Interval', static: true, field: 'param-8', type: 'input',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param-8']?.value?.replace(/['"0-9]+/g, '')) ? 'Add units h/m/s/ms' : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='INA226' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    ) 
}

export default {
    id: 'INA226',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["analog", "INA226", "adc","sensor","current", "voltage", "power", "i2c", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ina226'),
    getComponent: (node, nodeData, children) => <INA226 color={getColor('ina226')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { 
        return { 
            to: 'ina226',
            "param-1": { value: "", kind: "StringLiteral" },
            "param-2": { value: "0x40", kind: "StringLiteral" },
            "param-3": { value: "", kind: "StringLiteral" },
            "param-4": { value: "0.1ohm", kind: "StringLiteral"},
            "param-5": { value: "3.2A", kind: "StringLiteral"},
            "param-6": { value: "1100us", kind: "StringLiteral"},
            "param-7": { value: "128", kind: "StringLiteral"},
            "param-8": { value: "60s", kind: "StringLiteral" } 
        }
    }
}