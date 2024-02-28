import React from "react";
import {Node, Field, NodeParams } from 'protoflow';

const MPU6050 = ({node= {}, nodeData= {}, children}: any) => {
    const [name,setName] = React.useState(nodeData['param1'])
    const nameErrorMsg = 'Reserved name'
    const intervalErrorMsg = 'Add units h/m/s/ms'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param1', type: 'input', onBlur:()=>{setName(nodeData['param1'])},
            error: nodeData['param1']?.replace(/['"]+/g, '') == 'mpu6050' ? nameErrorMsg : null
        },
        {
            label: 'i2c bus name', static: true, field: 'param2', type: 'input',
        },
        {
            label: 'Address', static: true, field: 'param3', type: 'input', 
        },
        {
            label: 'Update Interval', static: true, field: 'param4', type: 'input',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param4']?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='MPU6050' color="#845686" id={node.id} skipCustom={true} >
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default MPU6050