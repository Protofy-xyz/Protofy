import React from "react";
import Node, { FlowPort, NodeParams } from '../../Node';
import FallbackPort from "../../FallbackPort";
import { Search } from "lucide-react";

const Find = (node: any = {}, nodeData = {}) => {
    return (
        <Node icon={Search} node={node} isPreview={!node?.id} title='find' id={node.id} color="#BA68C8" skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Array', field: 'to', type: 'input', pre: (str) => str.replace(".find", ""), post: (str) => str + ".find" }]} />
            <div style={{ marginBottom: '50px' }}></div>
            <FlowPort id={node.id} type='output' label='For Each (item, i)' style={{ top: '110px' }} handleId={'request'} />
            <FallbackPort node={node} port={'param-1'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(item, i) => " postText="" />
        </Node>
    )
}

export default Find