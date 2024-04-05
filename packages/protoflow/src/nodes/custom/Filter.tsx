import React from "react";
import Node, { FlowPort, NodeParams } from '../../Node';
import FallbackPort from "../../FallbackPort";
import { FilterIcon } from "lucide-react";

const Filter = (node: any = {}, nodeData = {}) => {
    return (
        <Node icon={FilterIcon} node={node} isPreview={!node?.id} title='filter' id={node.id} color="#F06292" skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Array', field: 'to', type: 'input', pre: (str) => str.replace(".filter", ""), post: (str) => str + ".filter" }]} />
            <div style={{ marginBottom: '50px' }}></div>
            <FlowPort id={node.id} type='output' label='For Each (item, i)' style={{ top: '110px' }} handleId={'request'} />
            <FallbackPort node={node} port={'param-1'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(item, i) => " postText="" />
        </Node>
    )
}

export default Filter