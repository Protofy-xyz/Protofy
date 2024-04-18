import React, {useEffect, useContext} from "react";
import { FlowStoreContext } from "./store/FlowsStore";
import { FlowPort } from "./Node";

const FallbackPort = ({node, port, type, fallbackPort, portType, preText, postText, fallbackText=""}) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const nodeData = useFlowsStore(state => state.nodeData[node?.id])
    useEffect(() => {
        if(node && node.id) {
            if(!nodeData?._fallBack || !nodeData._fallBack.find(x => x.port == port) ) {
                setNodeData(node.id,  {...nodeData, _fallBack:[...(nodeData?._fallBack??[]), {port:port, type: type, fallbackPort: fallbackPort,portType, fallbackText: fallbackText, preText: preText, postText: postText}]})
            }
        }
    }, [node?.id, nodeData])
    return <></>
}

export const FallbackPortList = ({ fallbacks, node, startPosX, height='50px' }) => {
    return <>
        {
            fallbacks.map((fb, index) => <div key={index}>
                <div style={{ height: height }}></div>
                <FlowPort id={node.id} type='input' label={fb.label} style={{ top: startPosX + (50 * (index + 1.6)) }} handleId={fb.name ?? fb.field} />
                <FallbackPort node={node} port={fb.field} type={"target"} fallbackText={fb.fallbackText ?? ''} fallbackPort={fb.name ?? fb.field} portType={"_"} preText={fb.preText} postText={fb.postText} />
            </div>)
        }
    </>
}

export default FallbackPort