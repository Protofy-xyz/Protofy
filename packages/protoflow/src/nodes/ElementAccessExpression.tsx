import React, { memo, useContext } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { nodeColors } from '.';
import { FlowStoreContext } from "../store/FlowsStore";
import { MdLan } from 'react-icons/md';

const ElementAccessExpression = (node) => {
    const { id, type } = node
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const nodeParams: Field[] = [
        { label: 'Variable', field: 'accessName', type: 'input' },
        { label: 'Key', field: 'key', type: 'input', fieldType: nodeData.fieldType }]
    
    return (
        <Node icon={MdLan} node={node} isPreview={!id} title={(nodeData?.accessName ?? 'x')+'['+(nodeData?.key ?? 'y')+']'} id={id} params={nodeParams} color={nodeColors[type]} />
    );
}
ElementAccessExpression.keyWords = ["[]"]
ElementAccessExpression.getData = (node, data, nodesData, edges) => {
    return {
        accessName: connectItem(node.getExpression(), 'output', node, 'accessName', data, nodesData, edges, 'accessName'),
        key: connectItem(node.getArgumentExpression(), 'output', node, 'key', data, nodesData, edges, 'key')
    }
}

ElementAccessExpression.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id];
    let accessName = dumpConnection(node, "target", "accessName", PORT_TYPES.data, data?.accessName??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    let key = dumpConnection(node, "target", "key", PORT_TYPES.data, data?.key??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    return accessName+'['+key+']'+ dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default React.memo(ElementAccessExpression)

