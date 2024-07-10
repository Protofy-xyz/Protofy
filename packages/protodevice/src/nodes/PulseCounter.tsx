import React from "react";
import { Node, Field, HandleOutput, NodeParams } from 'protoflow';

const PulseCounter = (node:any={}, nodeData={}, children) => {
    const nodeParams: Field[] = [
        { label: 'Name', static:true, field: 'param-1', type: 'input', post: (str) => str.toLowerCase() }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Pulse Counter' color="#FFAB91" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default PulseCounter