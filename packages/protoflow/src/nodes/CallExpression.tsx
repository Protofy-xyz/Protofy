import React, { memo, useContext } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType, getValueTrivia } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import AddPropButton from '../AddPropButton';
import { FlowStoreContext } from "../store/FlowsStore";
import { ArrowUpRight } from '@tamagui/lucide-icons';
import { useNodeColor } from '../diagram/Theme';
import { SyntaxKind } from 'ts-morph';
import { getArgumentsData, dumpArgumentsData } from '../utils/typesAndKinds';

const CallExpression = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const paramsArray = Object.keys(nodeData).filter(key => key.startsWith('param'))
    //get next available id for params
    const nextId = paramsArray.reduce((id, param) => {
        const result = parseInt(param.replace(/\D/g, ''), 10) > id ? parseInt(param.replace(/\D/g, ''), 10) : id
        //console.log('checking: ', param, parseInt(param.replace(/\D/g, ''), 10), 'over: ', id, 'wins: ', result)
        return result;
    }, 1) + 1

    const nodeParams: Field[] = [
        { label: 'To', field: 'to', type: 'input', description: 'Identifier name. Leave empty to access current scope' }
    ].concat(
        //@ts-ignore
        paramsArray.map((param, i) => {
            return { label: `Params[${i + 1}]`, field: param, type: 'input', deleteable: true } as Field
        })
    ) as Field[]

    return (
        <Node icon={ArrowUpRight} node={node} isPreview={!id} title={(nodeData.to ? nodeData.to : 'x') + '(' + (!id?'':(paramsArray.map(p => nodeData[p] ? dumpArgumentsData(nodeData[p]) : '...').join(',')))+ ')'} id={id} color={color}>
            <NodeParams id={id} params={nodeParams} />
            <NodeParams id={id} params={[{ label: 'Await', field: 'await', type: 'boolean', static: true }]} />
            <AddPropButton keyId={'param-' + nextId} id={id} nodeData={nodeData} />
        </Node>
    );
}
CallExpression.keywords = ['call', 'function', 'execute']
CallExpression.category = 'common'
CallExpression.defaultHandle = PORT_TYPES.data + 'to'
CallExpression.getData = (node, data, nodesData, edges) => {
    const parentNode = node.getParent()
    return {
        to: connectItem(node.getExpression(), 'output', node, 'to', data, nodesData, edges, 'to'),
        await: parentNode && parentNode.getKind() === SyntaxKind.AwaitExpression,
        ...node.getArguments().reduce((obj, param, i) => {
            var paramKey = 'param-' + (i + 1)
            var paramData = getArgumentsData(param)
            if (!paramData) {
                paramData = {
                    value: connectItem(param, 'output', node, paramKey, data, nodesData, edges, paramKey)
                }
            }
            return {
                ...obj,
                [paramKey]: paramData
            }
        }, {})
    }
}

function getTriviaBeforeCloseParenToken(callNode) {
    if (!callNode) return ''
    const fullText = callNode.getSourceFile().getFullText();
    const lastChild = callNode.getLastChild();

    if (lastChild && lastChild.getKindName() === 'CloseParenToken') {
        const leadingTriviaWidth = lastChild.getLeadingTriviaWidth();
        const triviaBeforeCloseBrace = fullText.substring(lastChild.getPos(), lastChild.getPos() + leadingTriviaWidth);

        return triviaBeforeCloseBrace;
    }
    return '';
}

CallExpression.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level = 0) => {
    const data = nodesData[node.id] ?? {};
    const keys = Object.keys(data).sort()

    const params = keys.filter(key => key.startsWith('param')).sort((a, b) => a.localeCompare(b, 'en', { numeric: true })).map((param) => {
        if(data[param]?._dump) return data[param]._dump(data, level)

        let part;
        const fallback = data._fallBack ? data._fallBack.find(f => f.port == param) : null

        if (fallback) {
            const content = dumpConnection(node, fallback.type, fallback.fallbackPort, fallback.portType, null, edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
            if (!content) {
                part = fallback.fallbackText
            } else {
                part = fallback.preText + content + fallback.postText
            }
        } else {
            part = dumpConnection(node, "target", param, PORT_TYPES.data, null, edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
            if (!part) {
                part = dumpArgumentsData(data[param])
            }
        }
        return part
    })
    const callName = dumpConnection(node, "target", "to", PORT_TYPES.data, data?.to ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)

    return callName ? (data.await ? 'await ' : '') + callName + "(" + params.join(',') + getTriviaBeforeCloseParenToken(data._astNode) + ")" : '' + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default memo(CallExpression)