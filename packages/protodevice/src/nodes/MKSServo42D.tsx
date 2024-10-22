import React, { useContext } from "react";
import { Node, Field, NodeParams, FlowStoreContext } from 'protoflow';
import { getColor } from ".";


const MKSServo42 = ({ node = {}, nodeData = {}, children, color }: any) => {
    const [name, setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(nodeData['param-1']) },
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'stepper' ? nameErrorMsg : null
        },
        {
            label: 'CAN bus name', static: true, field: 'param-2', type: 'input', onBlur: () => { setName(nodeData['param-2']) },
            error: nodeData['param-2']?.value?.replace(/['"]+/g, '') == 'canbus' ? nameErrorMsg : null
        },
        {
            label: 'Motor CAN id', static: true, field: 'param-3', type: 'input', onBlur: () => { setName(nodeData['param-3']) },
        },


    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='MKSServo42 Stepper driver' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'MKSServo42',
    type: 'CallExpression',
    category: "actuators",
    keywords: ["stepper", "motor","driver", "MKSServo42", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('mksServo42'),
    getComponent: (node, nodeData, children) => <MKSServo42 color={getColor('MKSServo42')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'mksServo42', 
        "param-1": { value: "", kind: "StringLiteral" }, 
        "param-2": { value: "", kind: "StringLiteral" }, 
        "param-3": { value: "", kind: "NumericLiteral"}
    } }
}