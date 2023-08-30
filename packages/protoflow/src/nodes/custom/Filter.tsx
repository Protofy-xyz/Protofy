import React from "react";
import Node, { FlowPort, NodeParams } from '../../Node';
import FallbackPort from "../../FallbackPort";
import { MdOutlineFilterAlt } from "react-icons/md";

const Filter = (node: any = {}, nodeData = {}) => {
    return (
        <Node icon={MdOutlineFilterAlt} node={node} isPreview={!node?.id} title='filter' id={node.id} color="#F06292" skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Array', field: 'to', type: 'input', pre: (str) => str.replace(".filter", ""), post: (str) => str + ".filter" }]} />
            <div style={{ marginBottom: '50px' }}></div>
            <FlowPort id={node.id} type='output' label='For Each (item, i)' style={{ top: '110px' }} handleId={'request'} />
            <FallbackPort node={node} port={'param1'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(item, i) => " postText="" />
        </Node>
    )
}

export default Filter