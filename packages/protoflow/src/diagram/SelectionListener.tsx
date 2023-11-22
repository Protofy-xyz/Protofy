import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    Panel,
    ReactFlowProvider,
    useOnSelectionChange 
} from 'reactflow';

export default ({onSelectionChange}) => {
    useOnSelectionChange({
        onChange: ({ nodes, edges }) => onSelectionChange(nodes, edges),
    });
    return <></>
}