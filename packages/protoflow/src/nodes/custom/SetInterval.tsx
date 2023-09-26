import React from "react";
import Node, { FlowPort, NodeParams } from '../../Node';
import FallbackPort from "../../FallbackPort";
import { Hourglass } from "lucide-react";


const SetInterval = (node: any = {}, nodeData = {}) => {
    return (
        <Node icon={Hourglass} node={node} isPreview={!node?.id} title='interval' id={node.id} color="#B0BEC5" skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Timer(ms)', field: 'param2', type: 'input' }]} />
            <div style={{ marginBottom: '50px' }}></div>
            <FlowPort id={node.id} type='output' label='On Interval' style={{ top: '120px' }} handleId={'request'} />
            <FallbackPort node={node} port={'param1'} type={"target"} fallbackPort={'request'} portType={"_"} preText="() => " postText="" />
        </Node>
    )
}

export default SetInterval