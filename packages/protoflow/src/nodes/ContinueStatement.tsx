import React from 'react';
import { dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { nodeColors } from '.';
import { MdRedo } from 'react-icons/md';
import { DataOutput } from '../lib/types';


const ContinueStatement =(node) => {
    const { id, type } = node
    const nodeParams: Field[] = []

    return (
        <Node icon={MdRedo} node={node} isPreview={!id} title={"continue"} id={id} params={nodeParams} color={nodeColors[type]} dataOutput={DataOutput.flow}/>
    );
}
ContinueStatement.keyWords = ["continue"]
ContinueStatement.getData = (node, data, edges) => {
    return {}
}
ContinueStatement.dataOutput = DataOutput.flow

ContinueStatement.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    return 'continue'+dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}
export default React.memo(ContinueStatement)
