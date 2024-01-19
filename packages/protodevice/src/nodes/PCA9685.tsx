import React from "react";
import {Node, Field, NodeParams } from 'protoflow';

const PCA9685 = ({node= {}, nodeData= {}, children}: any) => {
    const [name,setName] = React.useState(nodeData['param1'])
    const nameErrorMsg = 'Reserved name'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param1', type: 'input', onBlur:()=>{setName(nodeData['param1'])},
            error: nodeData['param1']?.replace(/['"]+/g, '') == 'i2c' ? nameErrorMsg : null
        },
        {
            label: 'Frequency', static: true, field: 'param2', type: 'input', 
        },
        {
            label: 'External clock input', static: true, field: 'param3', type: 'boolean', 
        },
        {
            label: 'Address', static: true, field: 'param4', type: 'input', 
        },
        {
            label: 'i2c Bus name', static: true, field: 'param5', type: 'input', 
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='PCA9685' color="#35b3b5" id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    ) 
}

export default PCA9685