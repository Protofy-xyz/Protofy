import React from "react";
import {Node, Field, NodeParams } from 'protoflow';

const PCA9685 = ({node= {}, nodeData= {}, children, color}: any) => {
    const [name,setName] = React.useState(nodeData['param-1'])
    const nameErrorMsg = 'Reserved name'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur:()=>{setName(nodeData['param-1'])},
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'i2c' ? nameErrorMsg : null
        },
        {
            label: 'Frequency', static: true, field: 'param-2', type: 'input', 
        },
        {
            label: 'External clock input', static: true, field: 'param-3', type: 'boolean', 
        },
        {
            label: 'Address', static: true, field: 'param-4', type: 'input', 
        },
        {
            label: 'i2c Bus name', static: true, field: 'param-5', type: 'input', 
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='PCA9685' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    ) 
}

export default PCA9685