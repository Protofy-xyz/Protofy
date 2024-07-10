import React from "react";
import { Node, Field, HandleOutput, NodeParams } from 'protoflow';
import { pinTable } from '../../../lib/device/Device'

const UltrasonicDistanceSensor = (node: any = {}, nodeData = {}, children) => {
    const transitionErrorMsg = 'Add units s/ms'

    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param-1', type: 'input', post: (str) => str.toLowerCase() },
        {
            label: 'ECHO Pin', static: true, field: 'param-2', type: 'select',
            data: pinTable.filter(item => !['GND', 'CMD', '0'].includes(item))
        },
        {
            label: 'Update Interval', static: true, field: 'param-3', type: 'input',
            error: !['s', 'ms'].includes(nodeData['param-3']?.value?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        },
        {
            label: 'Max distance', static: true, field: 'param-4', type: 'input'
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Ultrasonic Distance Sensor' color="#EF9A9A" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default UltrasonicDistanceSensor