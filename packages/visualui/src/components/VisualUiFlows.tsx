import React, { useEffect } from 'react'
import { FlowConstructor } from "protoflow/src/FlowBase"
import { useRouter } from 'next/router'
import { getKindName } from 'protoflow/src/nodes/JsxElement'
import {
    addChildNodeDataAndReorder, addEdgeChildAndReorder,
    dumpContent, moveEdgeChildAndReorder, removeDataChildAndReorder,
    reorderDataChilds, reorderEdgeChilds
} from 'protoflow/src/lib/FlowsOperations'
import { useVisualUi, useVisualUiAtom } from '../visualUiHooks'

export const UIFLOWID = "flows-ui"
const Flow = FlowConstructor(UIFLOWID)

export const VisualUiFlows = (props) => {
    // flows comms custom hook
    function useFlowsComms({ edges, nodeData, nodes, setEdges, setNodesData, deleteNodes, setNodes, createNode, setNodeData, _customComponents, onSaveNodes, flowId, data }) {
        const router = useRouter()
        const queryParams = router.query

        if (queryParams.experimental_comms === 'true') {
            console.log('flows: experimental communications')
            const {lastEvent} = useVisualUi(props.contextAtom)
            useEffect(() => {
                console.log('flowsEvent: ', lastEvent)
            }, [lastEvent])
        } else {
            console.log('flows: legacy communications')
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
                    case 'add-node':
                        var nodeName = uiData.nodeName
                        var parent = uiData.parent
                        var _data = uiData?.data ?? {};
                        var parentPos = nodes.find(n => n.id == uiData.parent)?.position
                        if (!parentPos) return
                        var newChildrenPos = uiData.childrenPos + 1;
                        var initialNodeData = uiData.nodeProps
                        const addedNodeData = Object.keys(initialNodeData).reduce((total, key) => {
                            var value: any = initialNodeData[key]
                            var keyName = `prop-${key}`
                            const valueKind = getKindName(value)

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
                        var newNodesData = { ...nodeData, [nodeId]: addedNodeData }
                        var customNode = _customComponents.find((n: any) => n.id == nodeName)
                        if (customNode) { //Check if node has mask
                            var initialData = {}
                            newNodesData = { ...newNodesData, [nodeId]: { ...newNodesData[nodeId] } }
                        }
                        const newNode = createNode([parentPos.x + 500, parentPos.y], "JsxElement", uiData.nodeId, _data, true, {}, initialData)
                        setNodes((nds) => nds.concat(newNode));
                        // Add child to parent
                        const dumpCode = dumpContent(nodes, edges, newNodesData, nodeId, 'JsxElement')
                        newNodesData = { ...newNodesData, [parent]: { ...addChildNodeDataAndReorder(newNodesData[parent], newChildrenPos, dumpCode ?? '"children"') } }
                        setNodesData(newNodesData)
                        //Add child edges from parent
                        newEdges = addEdgeChildAndReorder(edges, nodeId, parent, newChildrenPos)
                        setEdges(newEdges)
                        break;
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
