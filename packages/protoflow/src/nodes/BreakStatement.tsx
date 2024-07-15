import React from 'react';
import { dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { Link2Off } from '@tamagui/lucide-icons';
import useTheme, { useNodeColor } from '../diagram/Theme';

const BreakStatement =(node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const nodeParams: Field[] = []

    const nodeFontSize = useTheme('nodeFontSize')
    return (
        <Node icon={Link2Off} style={{minHeight: id ? (nodeFontSize*4+'px') : nodeFontSize, minWidth: nodeFontSize*10+'px'}} node={node} isPreview={!id} title={"break"} id={id} params={nodeParams} color={color}/>
    );
}
BreakStatement.keywords = ["break"]
BreakStatement.category = 'conditionals'
BreakStatement.getData = (node, data, edges) => {
    return {}
}

BreakStatement.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    return "break"+dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default React.memo(BreakStatement)