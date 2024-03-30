import React, {useContext} from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { FlowStoreContext } from "../store/FlowsStore";
import { DataOutput } from '../lib/types';
import { Reply } from 'lucide-react';
import { useNodeColor } from '../diagram/Theme';


const ReturnStatement =(node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const nodeParams: Field[] = [
        { label: 'Value', field: 'value', type: 'input'},
    ]

    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})

    return (
        <Node icon={Reply} node={node} isPreview={!id} title={"return"+(!node.id?'':(' '+nodeData.value))} id={id} params={nodeParams} color={color} dataOutput = {DataOutput.flow}/>
    );
}
ReturnStatement.category = "common"
ReturnStatement.keyWords = ["return"]
ReturnStatement.getData = (node, data, nodesData, edges) => {
    return {
        value: connectItem(node?.getExpression(), 'output', node, 'value', data, nodesData, edges, 'value'),
    }
}
ReturnStatement.dataOutput = DataOutput.flow
ReturnStatement.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id];
    let value = dumpConnection(node, "target", "value", PORT_TYPES.data, data?.value ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)??''
    return 'return ' + value + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default React.memo(ReturnStatement)



