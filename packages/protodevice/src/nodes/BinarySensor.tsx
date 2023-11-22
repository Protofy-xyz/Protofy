import React from "react";
import { Field, Node, NodeParams } from 'protoflow';
import NodeBus, { cleanName, generateTopic } from "../NodeBus";

const BinarySensor = (node:any={}, nodeData={}, children) => {
    const [name,setName] = React.useState(cleanName(nodeData['param1']))
    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input', onBlur:()=>{setName(cleanName(nodeData['param1']))}}
    ] as Field[]
    const type = 'binary_sensor';

    return (
        <Node node={node} isPreview={!node.id} title='Button' color="#A5D6A7" id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
            <NodeBus componentName={name} type={type}/>
        </Node>
    )
}

export default BinarySensor
