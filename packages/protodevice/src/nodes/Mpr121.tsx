import React from "react";
import { Node, Field, NodeParams } from '../../flowslib';
import NodeBus, { cleanName, generateTopic } from "../NodeBus";
import { pinTable } from '../../../lib/device/Device'

const Mpr121 = (node: any = {}, nodeData = {}, children) => {
    const [name, setName] = React.useState(cleanName(nodeData['param1']))
    const nameErrorMsg = 'Reserved name'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param1', type: 'input', onBlur: () => { setName(cleanName(nodeData['param1'])) }, pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"',
            error: nodeData['param1']?.replace(/['"]+/g, '') == 'mpr121' ? nameErrorMsg : null
        },
        {
            label: 'SCL', static: true, field: 'param2', type: 'select',
            data: pinTable.filter(item => !['GND', 'CMD', '0'].includes(item))
        },
        {
            label: 'Channel 0', static: true, field: 'param3', type: 'boolean'
        },
        {
            label: 'Channel 1', static: true, field: 'param4', type: 'boolean'
        },
        {
            label: 'Channel 2', static: true, field: 'param5', type: 'boolean'
        },
        {
            label: 'Channel 3', static: true, field: 'param6', type: 'boolean'
        },
        {
            label: 'Channel 4', static: true, field: 'param7', type: 'boolean'
        },
        {
            label: 'Channel 5', static: true, field: 'param8', type: 'boolean'
        },
        {
            label: 'Channel 6', static: true, field: 'param9', type: 'boolean'
        },
        {
            label: 'Channel 7', static: true, field: 'param10', type: 'boolean'
        },
        {
            label: 'Channel 8', static: true, field: 'param11', type: 'boolean'
        },
        {
            label: 'Channel 9', static: true, field: 'param12', type: 'boolean'
        },
        {
            label: 'Channel 10', static: true, field: 'param13', type: 'boolean'
        },
        {
            label: 'Channel 11', static: true, field: 'param14', type: 'boolean'
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='MPR121' color="#ffe082" id={node.id} skipCustom={true} >
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default Mpr121