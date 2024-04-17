import { getId } from './Node'
import { connectNodes } from './Edge';

export const filterCallbackProp = (propName) => {
    return (node, childScope, edges) => {
        const callbackId = edges.find(e => e.targetHandle == getId(node) + '-prop-' + propName)?.source
        const callBack = edges.find(e => e.targetHandle == callbackId + '_call')
        if (callBack) {
            edges.push(connectNodes(callBack.source, callBack.sourceHandle, getId(node), getId(node) + "_prop-" + propName))
        }
        return childScope.filter(child => child?.id != callbackId)
    }
}

export const filterCallback = (numParam = "2", handleId = "request") => {
    return (node, childScope, edges) => {
        const callbackId = edges.find(e => e.targetHandle == getId(node) + '-param-' + numParam)?.source
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
        const arrowEdge = originalEdges.find(e => e.targetHandle == node.id + '-param-' + numParam)
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
export const restoreCallbackProp = (propName) => {
    return (node, nodes, originalNodes, edges, originalEdges) => {
        const arrowEdge = originalEdges.find(e => e.targetHandle == node.id + '-prop-' + propName)
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