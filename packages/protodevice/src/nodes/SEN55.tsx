import React from "react";
import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";

const SEN55 = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const intervalErrorMsg = 'Add units h/m/s/ms'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'sen5x' ? nameErrorMsg : null
        },
        {
            label: 'i2c bus name', static: true, field: 'param-2', type: 'input',
        },
        {
            label: 'Address', static: true, field: 'param-3', type: 'input',
        },
        {
            label: 'Update Interval', static: true, field: 'param-4', type: 'input',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param-4']?.value?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='SEN55' color={color} id={node.id} skipCustom={true} >
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'SEN55',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["i2c","sen55", "air", "quality", "pm", "nox", "voc","humidity","temperature", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('sen55'),
    getComponent: (node, nodeData, children) => <SEN55 color={getColor('SEN55')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'sen55', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" }, "param-3": { value: "0x69", kind: "StringLiteral" }, "param-4": { value: "30s", kind: "StringLiteral" } } }
}