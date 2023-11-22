import React from "react";
import AddPropButton from "../../AddPropButton";
import Node, { Field, NodeParams } from '../../Node';
import { MessagesSquare } from "lucide-react";

const Fetch = (node: any = {}, nodeData = {}) => {
    const paramsArray = Object.keys(nodeData).filter(key => key.startsWith('param'))
    const nodeParams: Field[] = paramsArray.map((param, i) => {
        return { label: `Params[${i + 1}]`, field: param, type: 'input', deleteable: true } as Field
    }
    ) as Field[]
    return (
        <Node icon={MessagesSquare} node={node} isPreview={!node.id} title='fetch' id={node.id} color="#7986CB" skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
            <AddPropButton id={node.id} nodeData={nodeData} />
        </Node>
    )
}

export default Fetch
