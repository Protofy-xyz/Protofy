import React from "react";
import { Node, Field, NodeParams } from 'protoflow';
import { cleanName } from "../NodeBus";
import { pinTable } from '../../../lib/device/Device'

const BH1750 = (node: any = {}, nodeData = {}, children) => {
    const [name, setName] = React.useState(cleanName(nodeData['param-1']))
    const nameErrorMsg = 'Reserved name'
    const intervalErrorMsg = 'Add units h/m/s/ms'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input', onBlur: () => { setName(cleanName(nodeData['param-1'])) }, post: (str) => str.toLowerCase(),
            error: nodeData['param-1']?.replace(/['"]+/g, '') == 'bh1750' ? nameErrorMsg : null
        },
        {
            label: 'SCL', static: true, field: 'param-2', type: 'select',
            data: pinTable.filter(item => !['GND', 'CMD', '0'].includes(item))
        },
        { 
            label: 'Address', static: true, field: 'param-3', type: 'input'
        },
        {
            label: 'Update Interval', static: true, field: 'param-4', type: 'input',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param-4']?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        }
        
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='BH1750' color="#ffaa82" id={node.id} skipCustom={true} >
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default BH1750