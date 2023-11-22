import React, { useContext } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { nodeColors } from '.';
import { FlowStoreContext } from "../store/FlowsStore";
import { Calculator } from 'lucide-react';

export const UnaryExpressionFactory = (mode:"pre" | "post") => {
    const UnaryExpression = (node) => {
        const { id, type } = node
        const useFlowsStore = useContext(FlowStoreContext)
        const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
        const nodeParams: Field[] = [
            { label: 'Value', field: 'value', type: 'input' },
        ]

        nodeParams.push({ field: 'operator', type: 'select', data: ['++', '--', '!', '-'], static:true })
        
        if(mode == 'pre') {
            nodeParams.reverse()
        }
    
        const operator = nodeData.operator ?? '++'
        const operand = nodeData.value ?? 'x'
        return (
            <Node icon={Calculator} node={node} isPreview={!id} title={mode == 'pre'? operator+operand:operand+operator} id={id} params={nodeParams} color={nodeColors[type]}/>
        );
    }
    UnaryExpression.keyWords = ["pre", "++x", "x++","-x"]
    UnaryExpression.getData = (node, data, nodesData, edges) => {
        const opTable = {
            '40':'-',
            '45': '++',
            '46': '--',
            '53': '!'
        }

        return {
            operator: opTable[node.getOperatorToken()],
            value: connectItem(node.getOperand(), 'output', node, 'value', data, nodesData, edges, 'value'),
        }
    }

    UnaryExpression.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
        const data = nodesData[node.id];
        const value = dumpConnection(node, "target", "value", PORT_TYPES.data, data?.value ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        const expression = [data.operator, value]
        if(mode == 'post') expression.reverse()
        return expression.join('')+dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    }

    return React.memo(UnaryExpression)
}