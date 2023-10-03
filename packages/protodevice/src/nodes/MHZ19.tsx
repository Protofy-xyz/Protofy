import React from "react";
import { Node, Field, HandleOutput, NodeParams } from '../../flowslib';
import { pinTable } from '../../../lib/device/Device'

const MHZ19 = (node: any = {}, nodeData = {}, children) => {
    const transitionErrorMsg = 'Add units s/ms'

    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"' },
        {
            label: 'Rx Pin', static: true, field: 'param2', type: 'select',
            data: pinTable.filter(item => !['GND', 'CMD', '0'].includes(item))
        },
        {
            label: 'Update Interval', static: true, field: 'param3', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str + '"',
            error: !['s', 'ms'].includes(nodeData['param3']?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='MH-Z19' color="#A832A8" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default MHZ19
