import React from "react";
import { Node, Field, HandleOutput, NodeParams } from '../../flowslib';
import { pinTable } from '../../../lib/device/Device'

const HX711 = (node: any = {}, nodeData = {}, children) => {
    const transitionErrorMsg = 'Add units s/ms'

    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"' },
        {
            label: 'CLK Pin', static: true, field: 'param2', type: 'select',
            data: pinTable.filter(item => !['GND', 'CMD', '0'].includes(item))
        },
        { label: 'Gain', static: true, field: 'param3', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str + '"' },
        {
            label: 'Update Interval', static: true, field: 'param4', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str + '"',
            error: !['s', 'ms'].includes(nodeData['param4']?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='HX711 Load Cell' color="#B0BEC5" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default HX711
