import React from "react";
import { Node, Field, HandleOutput, NodeParams } from 'protoflow';
import { pinTable } from "../device/Device";

const Dfplayer = (node: any = {}, nodeData = {}, children) => {

    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input'},
        {
            label: 'Rx Pin', static: true, field: 'param2', type: 'select',
            data: pinTable.filter(item => !['GND', 'CMD', '0'].includes(item))
        },{
            label: 'Busy Pin', static: true, field: 'param3', type: 'select',
            data: pinTable.filter(item => !['GND', 'CMD', '0'].includes(item))
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Dfplayer MP3' color="#E0E0E0" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default Dfplayer
