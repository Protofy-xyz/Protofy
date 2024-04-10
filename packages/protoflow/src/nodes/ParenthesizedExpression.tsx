import React, { memo } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType, getId } from '../lib/Node';
import Node, { Field } from '../Node';
import { Parentheses } from 'lucide-react';
import { useNodeColor } from '../diagram/Theme';

const ParenthesizedExpression = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const nodeParams: Field[] = [
        { label: 'Value', field: 'value', type: 'input' },
    ]

    return (
        <Node icon={Parentheses} node={node} isPreview={!id} title={'()'} id={id} params={nodeParams} color={color} />
    );
}
ParenthesizedExpression.category = "operators"
ParenthesizedExpression.keywords = ["()"]
ParenthesizedExpression.getData = (node, data, nodesData, edges, mode) => {
    //console.log('in ParenthesizedExpression.getData: ', node)
    return {
        value: connectItem(node.getExpression(), 'output', node, 'value', data, nodesData, edges, 'value')
    }
}

ParenthesizedExpression.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id];
    let value = dumpConnection(node, "target", "value", PORT_TYPES.data, data?.value??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    return '(' + value + ')'+ dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default memo(ParenthesizedExpression)