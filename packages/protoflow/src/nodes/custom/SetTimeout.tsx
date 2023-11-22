import React from "react";
import Node, { FlowPort, NodeParams } from '../../Node';
import FallbackPort from "../../FallbackPort";
import { Timer } from "lucide-react";

const SetTimeout = (node: any = {}, nodeData = {}) => {
    return (
        <Node icon={Timer} node={node} isPreview={!node?.id} title='timeout' id={node.id} color="#EEEEEE" skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Timer(ms)', field: 'param2', type: 'input' }]} />
            <div style={{ marginBottom: '50px' }}></div>
            <FlowPort id={node.id} type='output' label='On Timeout' style={{ top: '110px' }} handleId={'request'} />
            <FallbackPort node={node} port={'param1'} type={"target"} fallbackPort={'request'} portType={"_"} preText="() => " postText="" />
        </Node>
    )
}

export default SetTimeout