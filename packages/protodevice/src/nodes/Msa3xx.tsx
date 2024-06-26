import React from "react";
import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";


const Msa3xx = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const intervalErrorMsg = 'Add units h/m/s/ms'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'msa' ? nameErrorMsg : null
        },
        {
            label: 'Update Interval', static: true, field: 'param-2', type: 'input',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param-2']?.value?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        },
        {
            label: 'i2c Bus name', static: true, field: 'param-3', type: 'input', 
        },
        {
            label: 'Model', static: true, field: 'param-4', type: 'select',
            data: ["MSA301","MSA311"]
        },
        {
            label: 'Range', static: true, field: 'param-5', type: 'select',
            data: ["2G","4G","8G","16G"]
        },
        {
            label: 'Resolution', static: true, field: 'param-6', type: 'select',
            data: ["8","10","12","14"]
        }
    ] as Field[]
    
    return (
        <Node node={node} isPreview={!node.id} title='MSA3xx Accelerometer Sensor' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'Msa3xx',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["i2c", "accelerometer","sensor","tap", "double tap", "position", "direction", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('msa3xx'),
    getComponent: (node, nodeData, children) => <Msa3xx color={getColor('Msa3xx')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'msa3xx', 
        "param-1": { value: "accelsensor", kind: "StringLiteral" }, 
        "param-2": { value: "15s", kind: "StringLiteral" },
        "param-3": { value: "i2cbusname", kind: "StringLiteral" },
        "param-4": { value: "MSA301", kind: "StringLiteral" },
        "param-5": { value: "4G", kind: "StringLiteral" },
        "param-6": { value: "12", kind: "StringLiteral" },
    } }
}