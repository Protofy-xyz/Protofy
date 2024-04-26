import { getId } from './Node'
import { connectNodes } from './Edge';

export const filterCallbackNodes = (paramId = "2", type = "param", handleId = "request") => {
    return (node, childScope, edges) => {
        const callbackId = edges.find(e => e.targetHandle == getId(node) + '-' + type + '-' + paramId)?.source
        const callBack = edges.find(e => e.targetHandle == callbackId + '_call')
        if (callBack) {
            edges.push(connectNodes(callBack.source, callBack.sourceHandle, getId(node), getId(node) + "_" + handleId))
        }
        return childScope.filter(child => child?.id != callbackId)
    }
}

export const filterConnection = (portId, cb?) => {
    return (node, childScope, edges, nodeData, setNodeData) => {
        const callbackId = edges.find(e => e.targetHandle == getId(node) + '-' + portId)?.source
        if(cb) cb(callbackId, nodeData, setNodeData)
        return childScope.filter(child => child?.id != callbackId)
    }
}

export const filterObject = ({port, keys, skipArrow}) => {
    port = port ?? 'param-1'
    skipArrow = skipArrow ?? true
    return (node, childScope, edges, nodeData, setNodeData) => {
        return filterConnection(port, (id, nodeData, setNodeData) => {
            const objData = nodeData[id]
            if(objData) {
                Object.keys(objData).forEach(key => {
                    const objEntry = objData[key]
                    const suffix = keys && keys[objEntry.key] && keys[objEntry.key] == 'output' ? '_' : '-'

                    if(key.startsWith('param-')) {
                        //get the edges that are connected to the node at the port in objEntry
                        let edge = edges.find(e => e.targetHandle == id+'-'+key)
                        if(edge) {
                            if(edge.source.startsWith('ArrowFunction_') && skipArrow) {
                                edge = edges.find(e => e.targetHandle == edge.source+'_call')
                                if(edge) {
                                    edge.target = getId(node)
                                    edge.targetHandle = getId(node) + suffix + 'mask-'+objEntry.key
                                }
                            }
                            edges.push(connectNodes(edge.source, edge.sourceHandle, getId(node), getId(node) + suffix + 'mask-'+objEntry.key))
                        } else {
                            setNodeData(getId(node), {
                                ...nodeData[getId(node)],
                                ['mask-'+objEntry.key]: { value: objEntry.value, kind: objEntry.kind ?? 'Identifier'}
                            })
                        }
                    }

                })
            }
        })(node, childScope, edges, nodeData, setNodeData)
    }
}

export const filterCallback = (numParam = "2", handleId = "request") => {
    return filterCallbackNodes(numParam, 'param', handleId)
}

export const filterCallbackProp = (paramId = "onPress") => {
    var type = 'prop'
    return filterCallbackNodes(paramId, type, type + "-" + paramId)
}

export const restoreCallbackNodes = (paramId, type) => {
    return (node, nodes, originalNodes, edges, originalEdges) => {
        const arrowEdge = originalEdges.find(e => e.targetHandle == node.id + '-' + type + '-' + paramId)
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

export const restoreCallback = (numParam = "2") => {
    return restoreCallbackNodes(numParam, 'param')
}

export const restoreCallbackProp = (paramId = "onPress") => {
    return restoreCallbackNodes(paramId, 'prop')
}