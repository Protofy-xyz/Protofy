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
        if (cb) cb(callbackId, nodeData, setNodeData)
        return childScope.filter(child => child?.id != callbackId)
    }
}

export const filterObject = ({ port, keys, skipArrow }) => {
    port = port ?? 'param-1'
    skipArrow = skipArrow ?? true
    let toRemove = []
    return (node, childScope, edges, nodeData, setNodeData) => {
        const id = edges.find(e => e.targetHandle == getId(node) + '-' + port)?.source
        const objData = nodeData[id]
        if (objData) {
            Object.keys(objData).forEach(key => {
                const objEntry = objData[key]
                const suffix = keys && keys[objEntry.key] && keys[objEntry.key] == 'output' ? '_' : '-'

                if (key.startsWith('param-')) {
                    //get the edges that are connected to the node at the port in objEntry
                    let edge = edges.find(e => e.targetHandle == id + '-' + key)
                    if (edge) {
                        if (edge.source.startsWith('ArrowFunction_') && skipArrow) {
                            toRemove.push(edge.source)
                            edge = edges.find(e => e.targetHandle == edge.source + '_call')
                        }
                        edges.push(connectNodes(edge.source, edge.sourceHandle, getId(node), getId(node) + suffix + 'mask-' + objEntry.key))
                    } else {
                        setNodeData(getId(node), {
                            ...nodeData[getId(node)],
                            ['mask-' + objEntry.key]: { value: objEntry.value, kind: objEntry.kind ?? 'Identifier' }
                        })
                    }
                }

            })
        }
        return childScope.filter(child => child?.id != id && !toRemove.includes(child.id))
    }
}

export const restoreObject = ({ port, skipArrow, keys }) => {
    port = port ?? 'param-1'
    skipArrow = skipArrow ?? true
    return (node, nodes, originalNodes, edges, originalEdges, nodeData) => {
        nodeData = { ...nodeData }
        const objEdge = originalEdges.find(e => e.targetHandle == node.id + '-' + port)
        let recoveredEdges = []
        let recoveredNodes: any = []
        if (objEdge) {
            const objNode = originalNodes?.find(n => n.id == objEdge.source)
            if (objNode) {
                recoveredNodes.push(objNode)
            }
            recoveredEdges = originalEdges.filter((e) => e.source == objNode?.id || e.target == objNode?.id)
            
        }
        let nodeEdges = edges.filter(e => e.target == node.id)
        let finalEdges = [...recoveredEdges, ...edges.filter(e => e.target != node.id)]
        finalEdges = finalEdges.filter((edge, index, self) =>
            index === self.findIndex((t) => (
                t.id === edge.id
            ))
        )
        //check for removed nodes in the edges
        finalEdges
            .filter(e => !nodes.find(n => n.id === e.source) && !recoveredNodes.find(n => n.id === e.source))
            .map(e => originalNodes.find(n => n.id === e.source))
            .filter(n => n)
            .forEach(n => recoveredNodes.push(n))

        const objNode = recoveredNodes.find(n => n.id.startsWith('ObjectLiteralExpression_'))
        if(objNode) {
            const params = Object.keys(nodeData[node.id]).filter(k => k.startsWith('mask-')).map(k => ({key: k, value: nodeData[node.id][k]}))
            params.forEach(param => {
                //look for param in nodeData[objNode.id]
                //it has the following shape: {'param-xxx': {key: xxx, value: 'value', kind: 'Identifier'}, 'param-yyy': ...}
                //param is xxx
                const objParam = Object.keys(nodeData[objNode.id]).find(k => nodeData[objNode.id][k].key == param.key.split('-')[1])
                nodeData = {
                    ...nodeData,
                    [objNode.id]: {
                        ...nodeData[objNode.id],
                        [objParam]: param.value?.value !== undefined ? { value: param.value.value, key: param.key.split('-')[1], kind: param.value.kind } : {value: param.value, key: param.key.split('-')[1], kind: 'Identifier'}
                    }
                }
                
                console.log('deleting node for: ', param.key)
                finalEdges = finalEdges.filter(e => e.targetHandle != objNode.id + '-'+objParam)
            })

            //rewire connections
            nodeEdges.forEach(edge => {
                let key = edge.targetHandle.split('-').slice(1).join('-')
                let parts = edge.targetHandle.split('_mask-')
                if(key.startsWith('mask-')) {
                    key = key.split('-').slice(1).join('-')
                    const objData = nodeData[objNode.id]
                    const objParam = Object.keys(objData).find(k => objData[k].key == key)
                    finalEdges = finalEdges.filter(e => e.targetHandle != objNode.id + '-'+objParam)
                    finalEdges.push(connectNodes(edge.source, edge.sourceHandle, objNode.id, objNode.id + '-' + objParam))
                } else if(parts.length > 1) {
                    key = parts[1]
                    const objData = nodeData[objNode.id]
                    const objParam = Object.keys(objData).find(k => objData[k] && objData[k].key == key)

                    if(!skipArrow) {
                        finalEdges = finalEdges.filter(e => e.targetHandle != objNode.id + '-'+objParam)
                        finalEdges.push(connectNodes(edge.source, edge.sourceHandle, objNode.id, objNode.id + '-' + objParam))
                    } else {
                        finalEdges = finalEdges.filter(e => e.targetHandle != objNode.id + '-'+objParam)
                        const arrowId = 'ArrowFunction_'+objNode.id+'_'+key
                        if(!recoveredNodes.find(n => n.id == arrowId)) {
                            recoveredNodes.push({
                                id: arrowId,
                                type: 'ArrowFunction',
                                data: {},
                                draggable: false,
                                deletable: true,
                                selectable: true,
                                position: { x: 0, y: 0 }
                            })
                            nodeData[arrowId] = {
                                async: true,
                                export: false,
                                isDefault: false,
                                name: "",
                                ...(keys && keys[key] ? {...keys[key]} : {})
                            }
                        }
                        const objParamId = objParam && objParam != "undefined" ? objParam : ('param-'+key)
                        if(nodeData[objNode.id]) {
                            nodeData[objNode.id][objParamId] = { key: key, value: '', kind: 'Identifier', removeIfNotConnected: true }
                        }

                        finalEdges.push(connectNodes(edge.source, edge.sourceHandle, arrowId, arrowId + '_call'))
                        finalEdges.push(connectNodes(arrowId, arrowId + '_call', objNode.id, objNode.id + '-' + (objParamId)))
                    }
                }
            })
        }

        /*
                //rewire connections
                const currentEdge = nodeEdges.find(e => e.targetHandle == node.id+'-'+param.key)
                finalEdges = finalEdges.filter(e => e.targetHandle != objNode.id + '-'+objParam)
                if(currentEdge) {
                    finalEdges.push(connectNodes(currentEdge.source, currentEdge.sourceHandle, objNode.id, objNode.id + '-' + objParam))
                }
        */
        

        return { nodes: [...recoveredNodes, ...nodes], edges: finalEdges, nodeData: nodeData }
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