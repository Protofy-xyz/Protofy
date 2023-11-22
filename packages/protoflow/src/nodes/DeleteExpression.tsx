import React, { memo, useContext } from 'react';
import { nodeColors } from '.';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { Trash } from 'lucide-react';
import { FlowStoreContext } from "../store/FlowsStore";
import { DataOutput } from '../lib/types';

const DeleteExpression = (node) => {
    const { id, type } = node
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const nodeParams: Field[] = [
        { label: 'Expression', field: 'expression', type: 'input' },
    ]
    return (
        <Node icon={Trash}  node={node} isPreview={!id} title={"delete "+ nodeData?.expression ?? 'expression'} params={nodeParams} id={id} color={nodeColors[type]} dataOutput={DataOutput.flow}>
        </Node>
    );
}
DeleteExpression.keyWords = ["delete"]
DeleteExpression.getData = (node, data, nodesData, edges) => {
    return {
        expression: connectItem(node?.getExpression(), 'output', node, 'expression', data, nodesData, edges, 'expression'),
    }
}
DeleteExpression.dataOutput = DataOutput.flow
DeleteExpression.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id];
    let expression = dumpConnection(node, "target", "expression", PORT_TYPES.data, data?.expression??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    return "delete "+ expression + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default memo(DeleteExpression)