import React, {useContext} from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { FlowStoreContext } from "../store/FlowsStore";
import { DataOutput } from '../lib/types';
import { Workflow } from '@tamagui/lucide-icons';
import { usePrimaryColor } from '../diagram/Theme';


const ReverseWorkflow = (props) => {
  return (
    <Workflow
      {...props}
      style={{
        ...(props.style || {}),
        transform: 'scale(-1, 1)', // espejo horizontal
      }}
    />
  )
}

const ReturnStatement =(node) => {
    const { id, type } = node
    const color = usePrimaryColor()
    const nodeParams: Field[] = [
        { label: 'Value', field: 'value', type: 'input'},
    ]

    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})

    return (
        <Node icon={ReverseWorkflow} node={node} isPreview={!id} title={"return"} id={id} params={nodeParams} color={color} dataOutput = {DataOutput.flow}/>
    );
}
ReturnStatement.category = "common"
ReturnStatement.keywords = ["return"]
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