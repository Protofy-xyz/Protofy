import React from "react";
import Node, { FlowPort, NodeParams } from '../../Node';
import FallbackPort from "../../FallbackPort";
import { MdOutlinePlaylistPlay } from "react-icons/md";

const Map = (node: any = {}, nodeData = {}) => {
    return (
        <Node icon={MdOutlinePlaylistPlay} node={node} isPreview={!node?.id} title='map' id={node.id} color="#E57373" skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Array', field: 'to', type: 'input', pre: (str) => str.replace(".map", ""), post: (str) => str + ".map" }]} />
            <div style={{ marginBottom: '50px' }}></div>
            <FlowPort id={node.id} type='output' label='For Each (item, i)' style={{ top: '110px' }} handleId={'request'} />
            <FallbackPort node={node} port={'param1'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(item, i) => " postText="" />
        </Node>
    )
}

export default Map