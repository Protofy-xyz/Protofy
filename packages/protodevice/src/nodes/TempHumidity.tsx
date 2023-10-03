import React from "react";
import { Node, Field, HandleOutput, NodeParams } from '../../flowslib';
import { pinTable } from '../../../lib/device/Device'

const TempHumidity = (node: any = {}, nodeData = {}, children) => {
    const transitionErrorMsg = 'Add units s/ms'

    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"' },
        {
            label: 'Model', static: true, field: 'param2', type: 'select', 
            data: ['"DHT11"', '"DHT22"', '"DHT22_TYPE2"','"AM2302"', '"RHT03"', '"SI7021"']
        },
        {
            label: 'Update Interval', static: true, field: 'param3', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str + '"',
            error: !['s', 'ms'].includes(nodeData['param3']?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Temperature & Humidity' color="#B0BEC5" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default TempHumidity
