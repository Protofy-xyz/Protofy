import React from "react";
import { Node, Field, NodeParams } from '../../flowslib';
import NodeBus, { cleanName, generateTopic } from "../NodeBus";
import { pinTable } from '../../../lib/device/Device'

const SEN55 = (node: any = {}, nodeData = {}, children) => {
    const [name, setName] = React.useState(cleanName(nodeData['param1']))
    const nameErrorMsg = 'Reserved name'
    const intervalErrorMsg = 'Add units h/m/s/ms'
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param1', type: 'input', onBlur: () => { setName(cleanName(nodeData['param1'])) }, pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str.toLowerCase() + '"',
            error: nodeData['param1']?.replace(/['"]+/g, '') == 'sen5x' ? nameErrorMsg : null
        },
        {
            label: 'SCL', static: true, field: 'param2', type: 'select', pre:(str) =>str.replace(/['"]+/g, ''), post: (str) => '"'+str+'"',
            data: pinTable.filter(item => !['GND', 'CMD', '0'].includes(item))
        },
        { 
            label: 'Address', static: true, field: 'param3', type: 'input', pre: (str) => str?.replace(/['"]+/g, ''), post: (str) => '"' + str + '"' 
        },
        {
            label: 'Update Interval', static: true, field: 'param4', type: 'input', pre: (str) => str.replace(/['"]+/g, ''), post: (str) => '"' + str + '"',
            error: !['h', 'm', 's', 'ms'].includes(nodeData['param4']?.replace(/['"0-9]+/g, '')) ? intervalErrorMsg : null
        }
        
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='SEN55' color="#337786" id={node.id} skipCustom={true} >
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default SEN55