import React from "react";
import Select from 'react-select';
import { Node, Field, NodeParams } from '../../flowslib';
import NodeBus, { cleanName, generateTopic } from "../NodeBus";
import { pinTable } from '../../../lib/device/Device'

const I2cSensorMatrix = (node: any = {}, nodeData = {}, children) => {
    const [name, setName] = React.useState(cleanName(nodeData['param-1']))
    const nameErrorMsg = 'Reserved name'
    const intervalErrorMsg = 'Add units h/m/s/ms'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(cleanName(nodeData['param-1'])) }, post: (str) => str.toLowerCase(),
            error: nodeData['param-1']?.value?.replace(/['"]+/g, '') == 'mpu6050' ? nameErrorMsg : null
        },
        {
            label: 'SCL', static: true, field: 'param-2', type: 'select',
            data: pinTable.filter(item => !['GND', 'CMD', '0'].includes(item))
        },
        {
            label: 'Update Interval', static: true, field: 'param-3', type: 'input',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param-3']?.value?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        },
        { 
            label: 'BH1750 Address', static: true, field: 'param-4', type: 'input'
        },
        { 
            label: 'HM3301 Address', static: true, field: 'param-5', type: 'input'
        },
        { 
            label: 'SEN0377 Address', static: true, field: 'param-6', type: 'input'
        },
        { 
            label: 'MPU6050 Address', static: true, field: 'param-7', type: 'input'
        }
        
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='I2cSensorMatrix' color="#376ea6" id={node.id} skipCustom={true} >
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default I2cSensorMatrix