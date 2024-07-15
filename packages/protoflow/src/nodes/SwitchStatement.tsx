import React, { memo, useContext } from 'react';
import { connectItem, dumpConnection, getId, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import AddPropButton from '../AddPropButton';
import { FlowStoreContext } from "../store/FlowsStore";
import { Split } from '@tamagui/lucide-icons';
import { DataOutput } from '../lib/types';
import { useNodeColor } from '../diagram/Theme';

const SwitchStatement = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    //@ts-ignore
    const nodeParams: Field[] = [
        { label: 'Expression', field: 'expression', type: 'input' },
    ].concat(
        //@ts-ignore
        Object.keys(nodeData).filter(key => key.startsWith('case-')).reduce((params, param, i) => {
            params = params.concat({ label: `case`, field: param, type: 'input', deleteable: true } as Field)
            params = params.concat({ label: `:`, field: `block${i}`, fieldType: 'clause' } as Field)
            return params
        }, []),
    )//.concat([{ label: `Default`, field: "default", type: 'case', static: true }]) as Field[]
    const defaultParam = [
        { label: `default :`, field: `defaultBlock`, fieldType: 'clause' } as Field
    ]
    return (
        <Node icon={Split} node={node} isPreview={!id} title='switch' id={id} color={color} dataOutput = {DataOutput.flow}>
            <NodeParams id={id} params={nodeParams} boxStyle={{ marginTop: '10px' }} />
            <AddPropButton id={id} nodeData={nodeData} type={'Case'} style={{ marginBottom: '20px' }} />
            <NodeParams id={id} params={defaultParam} boxStyle={{ marginBottom: '10px' }} />
        </Node>
    );
}
SwitchStatement.category = "conditionals"
SwitchStatement.keywords = ["switch", 'conditional', 'case', 'if']
SwitchStatement.getData = (node, data, nodesData, edges) => {
    const clauses = node.getCaseBlock().getClauses();
    let cases = {}
    if (clauses) {
        cases = clauses.reduce((obj, clause, i) => {
            if (clause.getKindName() == 'CaseClause') {
                const key = `case-${i + 1}`
                const clauseKey = `block${i}`
                const source = clause.getExpression()
                return {
                    ...obj,
                    [key]: connectItem(source, 'output', node, key, data, nodesData, edges, key),
                    [clauseKey]: connectItem(clause, 'output', node, clauseKey + PORT_TYPES.flow + 'output', data, nodesData, edges, clauseKey, [PORT_TYPES.data, PORT_TYPES.flow]),
                }
            } else { // DefaultClause
                return {
                    ...obj,
                    ['defaultBlock']: connectItem(clause, 'output', node, 'defaultBlock' + PORT_TYPES.flow + 'output', data, nodesData, edges, 'defaultBlock', [PORT_TYPES.data, PORT_TYPES.flow])
                }
            }
        }, {})
    }
    return {
        expression: connectItem(node.getExpression(), 'output', node, 'expression', data, nodesData, edges, 'expression'),
        ...cases
    }
}
SwitchStatement.dataOutput = DataOutput.flow
SwitchStatement.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id] ?? {};
    const expression = dumpConnection(node, "target", "expression", PORT_TYPES.data, data?.expression ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level, {})
    
    const defaultPortName = 'defaultBlock' + PORT_TYPES.flow + "output"
    const defaultBody = dumpConnection(node, "target", defaultPortName, PORT_TYPES.flow, data['defaultBlock'] ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level, {})
    const defaultText = defaultBody ? ('default: \n' + defaultBody + "\n") : ''
    
    const body = Object.keys(data).filter(key => key.startsWith('case')).map((param, i) => {
        let paramValue = dumpConnection(node, "target", param, PORT_TYPES.data, data[param] ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level, {}, false)
        let clauseKey = `block${i}`
        let portName = clauseKey + PORT_TYPES.flow + "output"
        const triviaInfo:any = {}
        const paramBody = dumpConnection(node, "target", portName, PORT_TYPES.flow, data[clauseKey] ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level, triviaInfo)
        return "\n"+"\t".repeat(level)+'case ' + paramValue + ":\n" + paramBody.replace(/^[\n\r\t]+/, '')
    }) 

    return 'switch(' + expression + ") {"+body.join("") + defaultText + "\n}" + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default memo(SwitchStatement)