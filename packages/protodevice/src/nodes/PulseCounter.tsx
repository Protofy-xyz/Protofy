import React from "react";
import { Node, Field, HandleOutput, NodeParams } from '../../flowslib';

const PulseCounter = (node:any={}, nodeData={}, children) => {
    const nodeParams: Field[] = [
        { label: 'Name', static:true, field: 'param1', type: 'input', pre:(str) =>str.replace(/['"]+/g, ''), post: (str) => '"'+str.toLowerCase()+'"' }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Pulse Counter' color="#FFAB91" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default PulseCounter