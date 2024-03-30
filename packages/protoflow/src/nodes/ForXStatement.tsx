import React, { memo, useContext } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, FlowPort, NodeParams } from '../Node';
import { FlowStoreContext } from "../store/FlowsStore";
import { Network } from 'lucide-react';
import { useNodeColor } from '../diagram/Theme';

export const ForXStatementFactory = (mode: 'in' | 'of') => {
    const ForXStatement = (node) => {
        const { id, type } = node
        const color = useNodeColor(type)
        const useFlowsStore = useContext(FlowStoreContext)
        const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
        const nodeParams: Field[] = [
            { label: 'Element', field: 'element', type: 'input' },
            { label: 'Iterator', field: 'iterator', type: 'input' }]

        return (
            <Node icon={Network} node={node} isPreview={!id} title={"for(" + (nodeData?.element ?? 'element') + ` ${mode} ` + (nodeData?.iterator ?? 'item') + ")"} id={id} color={color}>
                <NodeParams id={id} params={nodeParams} boxStyle={{ marginTop: '0px', marginBottom: '80px' }} />
                <FlowPort id={id} type='input' label='Loop' style={{ top: '180px' }} handleId={'loop'} />
            </Node>
        );
    }
    ForXStatement.category = 'loops'
    ForXStatement.keyWords = ["for", "for-in", "for-of"]
    ForXStatement.getData = (node, data, nodesData, edges) => {
        if (node.getStatement()) {
            connectItem(node.getStatement(), 'output', node, 'loop', data, nodesData, edges, null, [PORT_TYPES.data, PORT_TYPES.flow])
        }

        const initializer = node.getInitializer();
        const expression = node.getExpression();
        return {
            element: connectItem(initializer, 'output', node, 'element', data, nodesData, edges, 'element'),
            iterator: connectItem(expression, 'output', node, 'iterator', data, nodesData, edges, 'iterator')
        }
    }

    ForXStatement.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
        const data = nodesData[node.id];
        const loop = dumpConnection(node, "target", "loop", PORT_TYPES.flow, '{}', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        let element = dumpConnection(node, "target", "element", PORT_TYPES.data, data?.element ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        let iterator = dumpConnection(node, "target", "iterator", PORT_TYPES.data, data?.iterator ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        const loopCode = 'for(' + element + ` ${mode} ` + iterator + ' ) ' + loop + "\n";
        return loopCode + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    }
    return ForXStatement
}

export default React.memo(ForXStatementFactory('in'))

