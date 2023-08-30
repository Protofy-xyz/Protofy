import React from "react";
import { Node, Field, HandleOutput, NodeParams } from '../../flowslib';

const Relay = (node:any={}, nodeData={}, children) => {
    const nodeParams: Field[] = [
        { label: 'Name', static:true, field: 'param1', type: 'input', pre:(str) =>str.replace(/['"]+/g, ''), post: (str) => '"'+str.toLowerCase()+'"' },
        { label: 'Restore Mode', static:true, field: 'param2', type: 'select', data:['"ALWAYS_ON"', '"ALWAYS_OFF"'] }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='GPIO Switch' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default Relay