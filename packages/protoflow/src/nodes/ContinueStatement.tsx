import React from 'react';
import { dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { Redo } from 'lucide-react';
import { DataOutput } from '../lib/types';
import { useNodeColor } from '../diagram/Theme';

const ContinueStatement =(node) => {
    const { id, type } = node
    const nodeParams: Field[] = []
    const color = useNodeColor(type)
    return (
        <Node icon={Redo} node={node} isPreview={!id} title={"continue"} id={id} params={nodeParams} color={color} dataOutput={DataOutput.flow}/>
    );
}
ContinueStatement.keywords = ["continue", 'case', 'switch']
ContinueStatement.category = 'conditionals'
ContinueStatement.getData = (node, data, edges) => {
    return {}
}
ContinueStatement.dataOutput = DataOutput.flow

ContinueStatement.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    return 'continue'+dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}
export default React.memo(ContinueStatement)
