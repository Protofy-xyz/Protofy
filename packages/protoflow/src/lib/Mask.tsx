import { getId } from './Node'
import { connectNodes } from './Edge';

export const filterCallbackProp = () => {
    return (node, childScope, edges) => {
        // isProp case: onPress={() => ...}
        var nodesIdsToFilter = []
        var nodesToConnect = []
        var expressionId = edges.find(e => e.target == getId(node))?.source
        nodesIdsToFilter.push(expressionId)
        var arrowId = edges.find(e => e.target == expressionId)?.source
        nodesIdsToFilter.push(arrowId)
        var callId = edges.find(e => e.target == arrowId)?.source
        if (callId) {
            nodesToConnect.push(callId)
        }
        nodesToConnect?.forEach(nodeToConnectId => edges.push(connectNodes(nodeToConnectId, nodeToConnectId + "-output", getId(node), getId(node) + '_request')))
        return childScope.filter(child => !nodesIdsToFilter?.includes(child?.id))
    }
}

export const filterCallback = (numParam = "2", handleId = "request") => {
    return (node, childScope, edges) => {
        const callbackId = edges.find(e => e.targetHandle == getId(node) + '-param' + numParam)?.source
        const callBack = edges.find(e => e.targetHandle == callbackId + '_call')
        if (callBack) {
            // console.log('new edge: ', connectNodes(getId(node), getId(node) + '_request', callBack.target, callBack.targetHandle))
            edges.push(connectNodes(callBack.source, callBack.sourceHandle, getId(node), getId(node) + '_' + handleId))
        }
        return childScope.filter(child => child?.id != callbackId)
    }
}

export const restoreCallback = (numParam = "2") => {
    return (node, nodes, originalNodes, edges, originalEdges) => {
        const arrowEdge = originalEdges.find(e => e.targetHandle == node.id + '-param' + numParam)
        let recoveredEdges = []
        let recoveredNodes: any = []
        if (arrowEdge) {
            const arrowNode = originalNodes?.find(n => n.id == arrowEdge.source)
            if (arrowNode) {
                recoveredNodes.push(arrowNode)
            }
            recoveredEdges = originalEdges.filter((e) => e.source == arrowNode?.id || e.target == arrowNode?.id)
        }
        return { nodes: [...recoveredNodes, ...nodes], edges: [...recoveredEdges, ...edges] }
    }
}
export const restoreCallbackProp = () => {
    return (node, nodes, originalNodes, edges, originalEdges) => {
        let recoveredEdges = []
        let recoveredNodes: any = []
        if (originalEdges && originalNodes) {
            const expression = originalEdges.find(e => e.target == node.id)
            const arrow = edges.find(e => e.target == expression?.source)
            const call = edges.find(e => e.target == arrow?.source)
            if (expression && arrow && call) {
                const expressionNode = originalNodes.find(n => n.id == expression?.source)
                const arrowNode = originalNodes.find(n => n.id == arrow?.source)
                const callNode = originalNodes.find(n => n.id == call?.source)

                recoveredNodes.push(expressionNode)
                recoveredNodes.push(arrowNode)
                recoveredNodes.push(callNode)
                recoveredEdges = originalEdges.filter((e) => (e.source == expressionNode?.id
                    || e.target == expressionNode?.id
                    || e.source == arrowNode?.id
                    || e.target == arrowNode?.id
                    || e.source == callNode?.id
                    || e.target == callNode?.id
                ))
            }
        }
        return { nodes: [...recoveredNodes, ...nodes], edges: [...recoveredEdges, ...edges] }
    }
}