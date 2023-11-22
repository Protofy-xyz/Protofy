import React, { memo, useContext } from 'react';
import { FlowStoreContext } from '../store/FlowsStore';

const Layer = (node) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const { id, type } = node
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    switch(nodeData?.type) {
        case 'text':
            return <p style={nodeData?.data?.style}>{nodeData?.data?.text}</p>
        case 'image':
            return <></>
    }
    
}

export default memo(Layer)