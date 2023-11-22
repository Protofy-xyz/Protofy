import React, { memo } from 'react';
import { connectItem, dumpConnection, getId, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { nodeColors } from '.';
import { Crosshair } from 'lucide-react';
import { DataOutput } from '../lib/types';

const SpreadAssignment = (node) => {
    const { id, type } = node
    const nodeParams: Field[] = [
        { label: 'Expression', field: 'expression', type: 'input' },
    ]
    return (
        <Node icon={Crosshair} node={node} isPreview={!id} title={"..."} color={nodeColors['SpreadAssignment']} id={id} params={nodeParams} dataOutput = {DataOutput.spread}/>
    );;
}
SpreadAssignment.keyWords = ["spread", '...']
SpreadAssignment.getData = (node, data, nodesData, edges) => {
    //connect all children in a line
    const expression = node.getExpression()
    return {
        expression: connectItem(expression, 'output', node, 'expression', data, nodesData, edges, 'expression'),
    }
}
SpreadAssignment.dataOutput = DataOutput.spread
SpreadAssignment.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id];
    let expression = dumpConnection(node, "target", "expression", PORT_TYPES.data, data?.expression ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level) ?? ''
    return '...' + expression + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default memo(SpreadAssignment)