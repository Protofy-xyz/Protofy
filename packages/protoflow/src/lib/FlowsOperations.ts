import { NodeTypes } from '../nodes';
import { generateId } from './IdGenerator';
import { Project, IndentationText, ScriptTarget, ScriptKind, LanguageVariant, SyntaxKind } from "ts-morph";

export const removeDataChildAndReorder = (data = {}, posToRemove) => {
    let deletedElementData
    const newData = Object.keys(data).reduce((total, key) => {
        if (key.startsWith('child-')) {
            const childIndex = Number(key.split('child-')[1])
            if (childIndex === posToRemove) {
                deletedElementData = data[key] // Save data of moved element
                return total
            }
            else if (childIndex > posToRemove) return { ...total, ['child-' + (childIndex - 1)]: data[key] }
            return { ...total, [key]: data[key] }
        } else {
            return { ...total, [key]: data[key] }
        }
    }, {})
    return {
        data: newData,
        deletedElementData: deletedElementData
    }
}
export const addChildNodeDataAndReorder = (data, newChildPos, addChildData) => {
    var childLength = Object.keys(data)?.filter(k => k.startsWith('child-')).length
    return [...Object.keys(data), 'child-' + (childLength + 1)].reduce((total, key) => {
        if (key.startsWith('child-')) {
            const childIndex = Number(key.split('child-')[1])
            if (childIndex === newChildPos) return { ...total, ['child-' + newChildPos]: addChildData }
            else if (childIndex > newChildPos) return { ...total, ['child-' + (childIndex)]: data['child-' + (childIndex - 1)] }
        }
        return { ...total, [key]: data[key] }
    }, {})
}

export const moveEdgeChildAndReorder = (edges, nodeId, oldParentId, oldChildPos, newParentId = undefined, newChildPos = undefined) => {
    let newEdges = [];
    edges.forEach(ed => {
        const e = { ...ed }

        const childPreviousPos = Number(e.targetHandle.split(oldParentId + '-child-')[1])
        const childNewParentPos = Number(e.targetHandle.split(newParentId + '-child-')[1])

        if (childPreviousPos) {
            // start-delete oldParentEdges
            if (childPreviousPos > oldChildPos) {
                e['targetHandle'] = oldParentId + '-child-' + (childPreviousPos - 1)
                newEdges.push(e)
            }
            else if (childPreviousPos < oldChildPos) {
                newEdges.push(e)
            }
            // end-delete oldParentEdges
        }
        else if (childNewParentPos && childNewParentPos > (newChildPos - 1)) {
            // start-create newParentEdges
            e['targetHandle'] = newParentId + '-child-' + (childNewParentPos + 1)
            newEdges.push(e)
            // end-create newParentEdges
        }
        else {
            newEdges.push(e)
        }
    });
    if (newParentId && newChildPos) {
        const movedNodeEdge = {
            id: generateId(),
            targetHandle: newParentId + '-child-' + newChildPos,
            target: newParentId,
            source: nodeId,
            sourceHandle: nodeId + '-output',
            animated: false,
            type: 'custom'
        }
        newEdges.push(movedNodeEdge)
    }
    return newEdges;
}
export const addEdgeChildAndReorder = (edges, nodeId, parent, newChildPos) => {
    let newEdges = [];
    edges.forEach(ed => {
        const e = { ...ed }
        if (e.targetHandle.startsWith(parent + '-child-') && !(e.targetHandle.split(parent + '-child-')[1] < newChildPos)) {
            const childPos = e.targetHandle.split(parent + '-child-')[1]
            if (childPos >= newChildPos) {
                e['targetHandle'] = parent + '-child-' + (Number(childPos) + 1)
                newEdges.push(e)
            }
        } else {
            newEdges.push(e)
        }
    });
    const addedComponentEdge = {
        id: generateId(),
        targetHandle: parent + '-child-' + newChildPos,
        target: parent,
        source: nodeId,
        sourceHandle: nodeId + '-output',
        animated: false,
        type: 'custom'
    }
    newEdges.push(addedComponentEdge)
    return newEdges;
}
export const reorderEdgeChilds = (edges, parentId, offset, childrenIndexes) => {
    let newEdges = [];
    edges.forEach(ed => {
        const e = { ...ed }
        const childPreviousPos = e.targetHandle.split(parentId + '-child-')[1]
        if (e.targetHandle.startsWith(parentId + '-child-') && childrenIndexes.findIndex(ci => ci + 1 === Number(childPreviousPos)) != -1) {
            e['targetHandle'] = parentId + '-child-' + (offset + (childrenIndexes.findIndex(ci => (ci + 1) === Number(childPreviousPos)) + 1))
        }
        newEdges.push(e)
    });
    return newEdges;

}
export const reorderDataChilds = (data, newOrder, offset) => {
    const newData = { ...data }
    newOrder.forEach((prevChildIndex, index) => {
        newData['child-' + (offset + index + 1)] = data['child-' + (prevChildIndex + 1)]
    })
    return newData
}

export const deleteNodes = (nodesToDelete, parentId, nodeId, edges, nodeData) => {
    let updatedEdges
    edges.forEach(e => {//adds childs on nodes to delete, to delete connected nodes
        if (nodesToDelete.includes(e.target)) nodesToDelete.push(e.source)
    })
    var edgesToDelete = edges.filter(e => (nodesToDelete.includes(e.source) && e.target == parentId))
    let newNodeData = { ...nodeData }
    updatedEdges = edges
    edgesToDelete.forEach((edgeToDelete) => {
        let childPosToDelete = edgeToDelete ? Number(edgeToDelete.targetHandle.split('child-')[1]) : null
        updatedEdges = moveEdgeChildAndReorder(updatedEdges, nodeId, parentId, childPosToDelete) // move edge without new parents deletes the edge
        const { data: newNodeDataParent } = removeDataChildAndReorder(nodeData[parentId], childPosToDelete)
        newNodeData[parentId] = newNodeDataParent
    })
    return {
        updatedEdges,
        newNodeData
    }
}

export const deleteAdditionalKeys = (data) => (
    Object.keys(data).reduce((obj, nodeId) => {
        const currentNode = data[nodeId]
        // rawData contain keys that no start with "_"
        const rawData = Object.keys(currentNode).reduce((total, key) => {
            if (!key.startsWith('_') && key != 'connections' && key != 'SourceFile_0_0') { //WARNING: we are deleting connections from some nodes (Block)
                total = { ...total, [key]: currentNode[key] }
            }
            return total
        }, {})
        obj = { ...obj, [nodeId]: rawData }
        return obj
    }, {})
)

export const dumpContent = (nodes, edges, nodesData, nodeId, type) => {
    var element = NodeTypes[type].type
    const dumpCode = element?.dump({ id: nodeId, type: type }, nodes, edges, nodesData)
    return dumpCode
}

export const findJsxElementByNodeId = (nodeId, edges) => {
    const connectedEdge = edges.find(e => e.source == nodeId);
    if (!connectedEdge) return
    const connectedNodePort = connectedEdge.targetHandle
    const isJsxElementNode = connectedNodePort.split('_')[0] === 'JsxElement';
    if (isJsxElementNode) return connectedNodePort
    return findJsxElementByNodeId(connectedEdge.target, edges)
}

export const findJsxElementDumpedPropValue = (nodes, edges, nodeData, nodeId, nodeType, propKey) => {
    const dumpCode = dumpContent(nodes, edges, nodeData, nodeId, nodeType)
    const source = getSource(dumpCode)
    //@ts-ignore
    const propContent = source.getFirstDescendantByKind(SyntaxKind["JsxElement"])?.getOpeningElement()?.getAttributes()?.find(atr => atr?.getName() == propKey)
    //@ts-ignore
    const propValue = propContent?.getInitializer()?.getText();
    return propValue
}

export const getSource = (sourceCode, filename = "customCode.tsx") => {
    const project = new Project({
        useInMemoryFileSystem: true,
        manipulationSettings: { indentationText: IndentationText.Tab },
        compilerOptions: {
            target: ScriptTarget.Latest,
            scriptKind: ScriptKind.TSX,
            languageVariant: LanguageVariant.JSX
        },
    })
    const source = project.createSourceFile(filename, sourceCode, { overwrite: true })
    return source
}