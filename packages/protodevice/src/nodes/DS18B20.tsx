import React from "react";
import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";

const DS18B20 = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'dallas' ? nameErrorMsg : null
        },
        {
            label: 'Dallas Bus Name', static: true, field: 'param-2', type: 'input'
        },
        {
            label: 'Address', static: true, field: 'param-3', type: 'input'
        }
    ] as Field[]

    return (
        <Node node={node} isPreview={!node.id} title='Dallas Temperature DS18B20' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'DS18B20',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["onewire", "temperature", "ds18b20", "one", "wire", "dallas", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('ds18b20'),
    getComponent: (node, nodeData, children) => <DS18B20 color={getColor('DS18B20')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { 
        return { 
            to: 'ds18b20', 
            "param-1": { value: "tempsensor", kind: "StringLiteral" },
            "param-2": { value: "mydallasbus", kind: "StringLiteral" },
            "param-3": { value: "0xA40000031F055028", kind: "StringLiteral" } 
        } 
    }
}