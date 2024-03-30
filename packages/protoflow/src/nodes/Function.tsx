import React, { memo, useContext } from 'react';
import { connectItem, dumpConnection, getId, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import AddPropButton from '../AddPropButton';
import { generateId } from '../lib/IdGenerator';
import { FlowStoreContext } from "../store/FlowsStore";
import { SyntaxKind } from "ts-morph";
import { FunctionSquare } from 'lucide-react';
import { useNodeColor } from '../diagram/Theme';

const Function = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const isArrow = (type == 'ArrowFunction')
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const name = isArrow ? [] : [{ label: 'Name', static: true, field: 'name', type: 'input', description: 'Function name' }] as Field[]

    const nodeParams: Field[] = name.concat(Object.keys(nodeData).filter((p) => p.startsWith('param-')).map((param: any, i) => {
        return { label: nodeData[param].isBindingPattern ? `${"Params[" + (i + 1) + "]"}` : param.substr(6), field: param, fieldType: 'parameter', deleteable: true } as Field
    }))

    return (
        <Node icon={FunctionSquare} node={node} isPreview={!id} title={isArrow ? '=>' : nodeData.name?nodeData.name:'function'} id={id} color={color}>
            <NodeParams id={id} params={[{ label: 'Call', field: 'call', fieldType: 'call', type: 'input' }]} />
            <NodeParams id={id} params={nodeParams} />
            {type != 'FunctionExpression' ?
                <>
                    <NodeParams id={id} params={[{ label: 'Async', field: 'async', type: 'boolean', static: true }]} boxStyle={{ marginTop: '40px' }} />
                    <NodeParams id={id} params={[{ label: 'Export', field: 'export', type: 'boolean', static: true }]} />
                    {nodeData.export ? <NodeParams id={id} params={[{ label: 'isDefault', field: 'isDefault', type: 'boolean', static: true }]} /> : null}
                </>
                : <div style={{ marginTop: '26px' }}></div>
            }

            <AddPropButton id={id} nodeData={nodeData} />
        </Node>
    );
}
Function.category= "program structure"
Function.keyWords = ['function', '=>', 'arrow']
Function.getData = (node, data, nodesData, edges) => {
    let thenId = getId(node.getBody())
    const body = connectItem(thenId, 'output', node, 'call', data, nodesData, edges, null, [PORT_TYPES.data, PORT_TYPES.flow])

    return {
        ...node.getParameters().reduce((obj, param, i) => {
            const uuid = generateId()
            const sourceValue = param.getInitializer()
            let sourceKey = param.getName()
            const nodeType = param.getTypeNode()
            const type = nodeType ? nodeType.getText() : null
            const isBindingPattern = !!param.getDescendantsOfKind(SyntaxKind.ObjectBindingPattern).length
            if (isBindingPattern) {
                sourceKey = param.getDescendantsOfKind(SyntaxKind.ObjectBindingPattern)[0]
            }
            return {
                ...obj,
                ['param-' + uuid]: {
                    key: isBindingPattern ? connectItem(sourceKey, 'output', node, 'param-' + uuid, data, nodesData, edges, 'key') : param.getName(),
                    value: sourceValue ? connectItem(sourceValue, 'output', node, 'param-' + uuid, data, nodesData, edges, 'value') : '',
                    isBindingPattern: isBindingPattern,
                    type: type
                }
            }
        }, {
            name: node.getName && node.getName() != undefined ? node.getName() : '',
            export: node.getModifiers ? (node.getModifiers().find(m => m.getText() == 'export') ? true : false) : false,
            isDefault: node.getModifiers ? (node.getModifiers().find(m => m.getText() == 'default') ? true : false) : false,
            async: !!node.getModifiers().find(m => m.getKindName() == 'AsyncKeyword'),
            call: body,
            type: node.getReturnTypeNode() ? node.getReturnTypeNode().getText() : null
        })
    }
}

Function.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id] ?? {};
    const params = Object.keys(data).filter(key => key.startsWith('param')).map((param) => {
        let objParam;
        if (data[param].isBindingPattern) {
            const paramValue = dumpConnection(node, "target", param, PORT_TYPES.data, data[param].value, edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
            objParam = paramValue + (data[param].type ? `:${data[param].type}` : "")
        }
        else {
            let paramName = dumpConnection(node, "target", param + '-key', PORT_TYPES.data, data[param].key, edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
            const paramValue = dumpConnection(node, "target", param, PORT_TYPES.data, data[param].value, edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
            objParam = paramName + (data[param].type ? `:${data[param].type}` : "") + (paramValue ? ("=" + paramValue) : "")
        }
        return objParam
    })

    const body = dumpConnection(node, "target", "call", PORT_TYPES.flow, data.call ?? '{}', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level, {}, true)
    let total = (data.export ? 'export ' : '') + (data.export && data.isDefault ? 'default ' : '') + (data.async ? 'async ' : '')
    if (node.type == 'ArrowFunction') {
        total += "(" + params.join(',') + ") => " + body
    } else {
        //const wrap = body.startsWith('{') ? false : true
        total += "function " + data.name + "(" + params.join(',') + ") " + (data.type ? ':'+data.type+' ' : '')  + body
    }
    return total + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)

}

export default memo(Function)