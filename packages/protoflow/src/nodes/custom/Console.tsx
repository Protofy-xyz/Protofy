import React from "react";
import AddPropButton from "../../AddPropButton";
import Node, { Field, NodeParams } from '../../Node';
import { MessageSquare } from "lucide-react";

const Console = (node:any={}, nodeData={}) => {
    const { id, type } = node
    const paramsArray = Object.keys(nodeData).filter(key => key.startsWith('param'))
    const nodeParams: Field[] = [
        { label: 'Type', field: 'to', type: 'select', data: ['console.log', 'console.error', 'console.warn', 'console.info', 'console.trace', 'console.assert', 'console.clear', 'console.count', 'console.dir', 'console.table', 'console.time', 'console.group'], static: true  }
    ].concat(
        //@ts-ignore
        paramsArray.map((param, i) => {
            return { label: `Params[${i + 1}]`, field: param, type: 'input', deleteable: true} as Field
        })
    ) as Field[]
    return (
        <Node icon={MessageSquare} node={node} isPreview={!node.id} title='console' id={node.id} color="#BCAAA4" skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
            <AddPropButton id={node.id} nodeData={nodeData} />
        </Node>
    )
}

export default Console
