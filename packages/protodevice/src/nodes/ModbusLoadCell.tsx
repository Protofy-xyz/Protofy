import React from "react";
import { Node, Field, HandleOutput, NodeParams } from '../../flowslib';
import { pinTable } from '../../../lib/device/Device'

const ModbusLoadCell = (node: any = {}, nodeData = {}, children) => {
    const transitionErrorMsg = 'Add units s/ms'

    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"' },
        {
            label: 'Rx Pin', static: true, field: 'param2', type: 'select',
            data: pinTable.filter(item => !['GND', 'CMD', '0'].includes(item))
        },
        {
            label: 'DS Enable Pin', static: true, field: 'param3', type: 'select',
            data: pinTable.filter(item => !['GND', 'CMD', '0'].includes(item))
        },
        {
            label: 'Update Interval', static: true, field: 'param4', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str + '"',
            error: !['s', 'ms'].includes(nodeData['param4']?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        },
        { label: 'Weight register', static: true, field: 'param5', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str + '"' },
        {
            label: 'Weight registers to read', static: true, field: 'param6', type: 'select',
            data: ['"1"', '"2"']
        },
        { label: 'State flags register', static: true, field: 'param7', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str + '"' }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Modbus Load Cell' color="#E0B0EE" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default ModbusLoadCell
