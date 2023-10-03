import React from "react";
import  {Node, Field, HandleOutput, NodeParams } from '../../flowslib';

const OutputPin = (node:any={}, nodeData={}, children) => {
    const nodeParams: Field[] = [
        { label: 'Id', static:true, field: 'param1', type: 'input' }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='OutputPin' color="#FFF59D" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default OutputPin
