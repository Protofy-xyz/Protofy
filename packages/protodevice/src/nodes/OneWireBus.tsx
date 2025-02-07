import React from "react";
import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";

const DallasBus = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'dallas' ? nameErrorMsg : null
        }
    ] as Field[]

    return (
        <Node node={node} isPreview={!node.id} title='One wire Bus' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'OneWireBus',
    type: 'CallExpression',
    category: "bus",
    keywords: ["onewire", "temperature", "one", "wire", "dallas", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('oneWireBus'),
    getComponent: (node, nodeData, children) => <DallasBus color={getColor('OneWireBus')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { 
        return { 
            to: 'oneWireBus', 
            "param-1": { value: "myonewirebus", kind: "StringLiteral" },
        } 
    }
}