import React, { memo } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { Split } from 'lucide-react';
import { useNodeColor } from '../diagram/Theme';

const ConditionalExpression = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const nodeParams: Field[] = [
        { label: 'Condition', field: 'condition', type: 'input' },
        { label: 'When true', field: 'whenTrue', type: 'input' },
        { label: 'When false', field: 'whenFalse', type: 'input' },
    ]
    return (
        <Node icon={Split}  node={node} isPreview={!id} title='ternary' params={nodeParams} id={id} color={color} >
        </Node>
    );
}
ConditionalExpression.keyWords = ["ternary"]
ConditionalExpression.category = 'conditionals'
ConditionalExpression.getData = (node, data, nodesData, edges) => {
    return {
        condition: connectItem(node?.getCondition(), 'output', node, 'condition', data, nodesData, edges, 'condition'),
        whenTrue: connectItem(node?.getWhenTrue(), 'output', node, 'whenTrue', data, nodesData, edges, 'whenTrue'),
        whenFalse: connectItem(node?.getWhenFalse(), 'output', node, 'whenFalse', data, nodesData, edges, 'whenFalse')
    }
}

ConditionalExpression.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id];
    let condition = dumpConnection(node, "target", "condition", PORT_TYPES.data, data?.condition??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    let whenTrue = dumpConnection(node, "target", "whenTrue", PORT_TYPES.data, data?.whenTrue??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    let whenFalse = dumpConnection(node, "target", "whenFalse", PORT_TYPES.data, data?.whenFalse??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    return condition + '?' + whenTrue + ':' + whenFalse  + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default memo(ConditionalExpression)