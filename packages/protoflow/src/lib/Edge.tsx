import { v4 as uuidv4 } from 'uuid';
import { getId } from './Node';
import { generateId } from './IdGenerator';

export const connectNodes = (sourceNodeId: string, sourceHandleId: string, targetNodeId: string, targetHandleId: string) => {
    let edgeData: any = {
        id: uuidv4(),
        source: sourceNodeId,
        sourceHandle: sourceHandleId,
        target: targetNodeId,
        targetHandle: targetHandleId,
        animated: false,
        type: "custom", // 'default'|'step'|'smoothstep'|'straight'
    }
    return edgeData
}

export const isPullEdge = (handleId1: string | undefined | null, handleId2: string | undefined | null) => {
    return (handleId1?.includes('-') && handleId2?.includes('-'))
}


export const isPortConnected = (node, port, portType, edges) => {

    return !!edges.find(e => {
        const match = e.sourceHandle == getId(node) + portType + port || e.targetHandle == getId(node) + portType + port
        //console.log('checking: ', e.sourceHandle, e.targetHandle, 'against: ', getId(node) + portType + port, match)
        return match
    })
}

export const splitOpenerEdge = (menuOpener, newNodeId, defaultHandle) => {
    var edges = []
    const targetEdge = {
        id: generateId(),
        source: newNodeId,
        sourceHandle: newNodeId + '-output',
        target: menuOpener.target,
        targetHandle: menuOpener.targetHandle,
        type: 'custom',
    }

    edges.push(targetEdge)

    if (defaultHandle) {
        const sourceEdge = {
            id: generateId(),
            source: menuOpener.source,
            sourceHandle: menuOpener.sourceHandle,
            target: newNodeId,
            targetHandle: newNodeId + defaultHandle,
            type: 'custom',
        };
        edges.push(sourceEdge)
    }
    return edges
};