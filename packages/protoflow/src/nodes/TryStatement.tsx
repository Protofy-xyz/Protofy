import React, { memo } from 'react';
import { nodeColors } from '.';
import { connectItem, dumpConnection, getId, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, FlowPort, NodeParams } from '../Node';
import { DataOutput } from '../lib/types';
import { ListTodo } from 'lucide-react';

const TryStatement = (node) => {
    const { id, type } = node
    const nodeParams: Field[] = [
        { label: 'Error', field: 'error', type: 'input', static: true }
    ]
    return (
        <Node icon={ListTodo} node={node} isPreview={!id} title='try' id={id} color={nodeColors[type]} dataOutput = {DataOutput.flow}>
            <NodeParams id={id} params={nodeParams} boxStyle={{ marginTop: '70px', marginBottom: '30px' }} />
            <FlowPort id={id} type='input' label='Try' style={{ top: '60px' }} handleId={'try'} />
            <FlowPort id={id} type='input' label='Catch' style={{ top: '90px' }} handleId={'catch'} />
        </Node>
    );
}
TryStatement.keyWords = ["try"]
TryStatement.getData = (node, data, nodesData, edges) => {
    const tryId = data[getId(node.getTryBlock())]?.value?.id
    const catchId = data[getId(node.getCatchClause().getBlock())]?.value?.id

    return {
        try: connectItem(tryId, 'output', node, 'try',data, nodesData, edges, 'try', [PORT_TYPES.data, PORT_TYPES.flow]),
        catch: connectItem(catchId, 'output', node, 'catch', data, nodesData, edges, 'catch', [PORT_TYPES.data, PORT_TYPES.flow]),
        error: node.getCatchClause()?.getVariableDeclaration().getFullText()
    }
}
TryStatement.dataOutput = DataOutput.flow
TryStatement.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {     
    const data = nodesData[node.id];   
    const tryBody = dumpConnection(node, "target", "try", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    const catchBody = dumpConnection(node, "target", "catch", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    var error = dumpConnection(node, "source", "error", PORT_TYPES.data, data?.error??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    if(!error) error="e"

    return "try "+tryBody+"catch" + "("+error+")"  +" " + catchBody + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default memo(TryStatement)