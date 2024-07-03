import React, { useEffect } from 'react'
import { FlowConstructor } from "protoflow/src/FlowBase"
import { getKindName } from 'protoflow/src/nodes/JsxElement'
import {
    addChildNodeDataAndReorder, addEdgeChildAndReorder,
    dumpContent, moveEdgeChildAndReorder, removeDataChildAndReorder,
    reorderDataChilds, reorderEdgeChilds
} from 'protoflow/src/lib/FlowsOperations'
import { experimentalComms, useVisualUi, useVisualUiAtom } from '../visualUiHooks'

export const UIFLOWID = "flows-ui"
const Flow = FlowConstructor(UIFLOWID)

export const VisualUiFlows = (props) => {

    const getNodePropsData = (nodeName, propsData, data) => Object.keys(propsData).reduce((total, key) => {
        var value: any = propsData[key]
        var keyName = `prop-${key}`
        const valueKind = data?.kinds[key] ?? getKindName(value)

        var propValue = { key, value, kind: valueKind }

        if (key == 'children') {
            keyName = 'child-1'
            propValue = value
        }
        return {
            ...total,
            [keyName]: propValue
        }
    }, {
        name: nodeName
    })

    // flows comms custom hook
    function useFlowsComms({ edges, nodeData, nodes, setEdges, setNodesData, deleteNodes, setNodes, createNode, setNodeData, _customComponents, onSaveNodes, flowId, data }) {
        if (experimentalComms()) {
            const { lastEvent } = useVisualUi(props.contextAtom)
            useEffect(() => {
                if (lastEvent) {
                    switch (lastEvent.action) {
                        case "add-nodes": {
                            break;
                        };
                        case "edit-node": {
                            var editedNodeData
                            const field = lastEvent.field
                            const newValue = lastEvent.value
                            const nodeId = lastEvent.nodeId

                            if (lastEvent.type == 'prop') {
                                editedNodeData = {
                                    ["prop-" + field]: { ...nodeData[nodeId]["prop-" + field], value: newValue, key: field, kind: getKindName(newValue) }
                                }
                            } else {// edit node child
                                editedNodeData = {
                                    "child-1": newValue
                                }
                            }
                            var newNodesData = {
                                ...nodeData, [nodeId]: {
                                    ...nodeData[nodeId],
                                    ...editedNodeData
                                }
                            }

                            setNodesData(newNodesData)
                            break;
                        };
                        case "delete-node": {
                            break;
                        }
                        default: {
                            throw new Error("useVisualUi(...): Unhandled event type");
                        }
                    }
                }
            }, [lastEvent])
        } else {
            // TODO: JOIN DATA TOPIC USE EFFECTS
            useEffect(() => {
                const uiData = data[flowId + '/ui']
                if (!uiData) return
                var nodeId = uiData.nodeId
                let newEdges
                switch (uiData.action) {
                    case 'delete-node':
                        var nodesToDelete = uiData.deletedNodes ?? []
                        var parentId = uiData.parent
                        const { updatedEdges, newNodeData } = deleteNodes(nodesToDelete, parentId, nodeId, edges, nodeData)
                        setEdges(updatedEdges)
                        setNodesData(newNodeData)
                        setNodes(nds => nds.filter(n => !nodesToDelete.includes(n.id)))
                        break;
                    case 'add-nodes':
                        const parentData = uiData.parentData
                        var newNodesData = uiData.newNodesData

                        const newNodes = newNodesData.map(nd => createNode([0, 0], "JsxElement", nd.id, nd.data, true, {}, {})).flat()
                        setNodes(nd => nd.concat(newNodes));

                        var newData = newNodesData?.reduce((ndData, node) => {
                            const childs = node.childrens.reduce((total, child, index) => {
                                return {
                                    ...total,
                                    ["child-" + (index + 1)]: ""
                                }
                            }, {})
                            return {
                                ...ndData,
                                [node.id]: {
                                    ...getNodePropsData(node.name, node.props, node.data),
                                    ...childs
                                }
                            }
                        }, {
                            ...nodeData,
                            [parentData.id]: { ...addChildNodeDataAndReorder(nodeData[parentData.id], parentData.childrenPos + 1, '') }
                        })
                        
                        setNodesData(newData)

                        newEdges = newNodesData.reduce((total, curr) => {
                            var childPos = (newNodesData.find(n => n.childrens.includes(curr.id))?.childrens?.findIndex(c => c == curr.id) ?? parentData.childrenPos) + 1
                            return addEdgeChildAndReorder(total, curr.id, curr.parent, childPos)
                        }, edges)

                        setEdges(newEdges)
                        break
                    case 'edit-node':
                        var editedNodeData
                        const field = uiData.field
                        const newValue = uiData.value

                        if (uiData.type == 'prop') {
                            editedNodeData = {
                                ["prop-" + field]: { ...nodeData[nodeId]["prop-" + field], value: newValue, key: field, kind: getKindName(newValue) }
                            }
                        } else {// edit node child
                            editedNodeData = {
                                "child-1": newValue
                            }
                        }
                        var newNodesData = {
                            ...nodeData, [nodeId]: {
                                ...nodeData[nodeId],
                                ...editedNodeData
                            }
                        }

                        setNodesData(newNodesData)
                        break;
                    case 'move-node':
                        const isSameParent = uiData.isSameParent
                        if (isSameParent) {
                            let parent = uiData.parent;
                            let childrenIndexes = uiData.childrenIndexes;
                            let offset = Math.min(...childrenIndexes);
                            let prevParentNodeData = { ...nodeData[parent] };
                            // const newParentNodeData = { ...prevParentNodeData }
                            const newParentNodeData = reorderDataChilds(prevParentNodeData, childrenIndexes, offset)
                            setNodeData(parent, newParentNodeData)
                            const newEdges = reorderEdgeChilds(edges, parent, offset, childrenIndexes)
                            setEdges(newEdges)
                            return
                        }
                        else {
                            // start-remove child from old parent
                            const oldParentId = uiData.oldParentId;
                            const oldChildPos = uiData.oldPos + 1;
                            const oldParentNodeData = nodeData[oldParentId]

                            const { data: new_oldParentNodeData, deletedElementData: movedElementData } = removeDataChildAndReorder(oldParentNodeData, oldChildPos)
                            // end-remove child from old parent
                            // start-add child to new parent
                            const newParentId = uiData.newParentId;
                            const newParentNodeData = nodeData[newParentId]
                            if (!newParentNodeData) return
                            const numChilds = Object.keys(newParentNodeData).filter(k => k.startsWith('child-')).length;
                            const newChildPos = uiData.newPos == -1 ? (numChilds + 1) : (uiData.newPos + 1);

                            const new_newParentNodeData = addChildNodeDataAndReorder(newParentNodeData, newChildPos, movedElementData)
                            // end-add child to new parent
                            setNodesData({ ...nodeData, [oldParentId]: new_oldParentNodeData, [newParentId]: new_newParentNodeData })

                            const newEdges = moveEdgeChildAndReorder(edges, nodeId, oldParentId, oldChildPos, newParentId, newChildPos)
                            setEdges(newEdges)
                        }
                        break;
                }
            }, [data[flowId + '/ui']])

            useEffect(() => { // Send response
                if (data["savenodes"]?.value) {
                    onSaveNodes()
                }
            }, [data["savenodes"]])
        }
    }

    return <Flow
        {...props}
        flowId={UIFLOWID}
        enableCommunicationInterface={useFlowsComms}
    />
}
