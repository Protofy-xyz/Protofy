import React, {useEffect, useContext} from "react";
import { FlowStoreContext } from "./store/FlowsStore";

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

export default FallbackPort