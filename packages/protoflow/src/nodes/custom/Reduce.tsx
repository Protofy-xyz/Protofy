import React from "react";
import Node, { FlowPort, NodeParams } from '../../Node';
import FallbackPort from "../../FallbackPort";
import { MdMediation } from "react-icons/md";

const Reduce = (node: any = {}, nodeData = {}) => {
    return (
        <Node icon={MdMediation} node={node} isPreview={!node?.id} title='reduce' id={node.id} color="#9575CD" skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Array', field: 'to', type: 'input', pre: (str) => str.replace(".reduce", ""), post: (str) => str + ".reduce" }]} />
            <NodeParams id={node.id} params={[{ label: 'Initial Value', field: 'param2', type: 'input' }]} />
            <div style={{ marginBottom: '50px' }}></div>
            <FlowPort id={node.id} type='output' label='For Each (total, item, i)' style={{ top: '160px' }} handleId={'request'} />
            <FallbackPort node={node} port={'param1'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(total,item,i) => " postText="" />
        </Node>
    )
}

export default Reduce