import React, { useContext } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, FlowPort, NodeParams } from '../Node';
import { generateId } from '../lib/IdGenerator';
import { FlowStoreContext } from "../store/FlowsStore";
import { Layers } from 'lucide-react';
import { DataOutput } from '../lib/types';
import AddPropButton from '../AddPropButton';
import { useNodeColor } from '../diagram/Theme';

export const MethodFactory = (methodType) => {
    const component = (node) => {
        const { id, type } = node
        const color = useNodeColor(type)
        const useFlowsStore = useContext(FlowStoreContext)
        const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})

        const nodeParams: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('param')).map((param: any, i) => {
            return { label: param.substr(6), field: param, fieldType: 'parameter' } as Field
        })
        return (
            <Node icon={Layers} node={node} isPreview={!id} title={methodType} id={id} color={color} dataOutput={DataOutput.method}>
                <div style={{ height: '40px' }}></div>
                {methodType == 'method' ? <NodeParams id={id} params={[{ label: 'Name', field: 'name', type: 'input' }]} /> : null}
                <NodeParams id={id} params={nodeParams} />
                <AddPropButton id={id} nodeData={nodeData} type={'param-'} />
                <FlowPort id={id} type='input' label='Body' style={{ top: '60px' }} handleId={'body'} />
                <NodeParams id={id} params={[
                    { label: 'Static', field: 'static', type: 'boolean', static: true },
                    { label: 'Async', field: 'async', type: 'boolean', static: true }
                ]} />
                <NodeParams id={id} params={[{ field: 'level', type: 'select', data: ['public', 'private', 'protected'], static: true }]} />
            </Node>
        );
    }
    component.category = 'program structure'
    component.keyWords = ["method", "constructor", 'class']
    component.getData = (node, data, nodesData, edges) => {

        connectItem(node.getBody(), 'output', node, 'body', data, nodesData, edges, null, [PORT_TYPES.data, PORT_TYPES.flow])

        let level = 'public';
        if (node.getModifiers().find(m => m.getKindName() == 'PublicKeyword')) {
            level = 'public'
        } else if (node.getModifiers().find(m => m.getKindName() == 'PrivateKeyword')) {
            level = 'private'
        } else if (node.getModifiers().find(m => m.getKindName() == 'ProtectedKeyword')) {
            level = 'protected'
        }

        return {
            ...node.getParameters().reduce((obj, param, i) => {
                const uuid = generateId()
                const source = param.getInitializer()
                const nodeType = param.getTypeNode()
                const type = nodeType ? nodeType.getText() : null
                if (node.getName) {
                    obj.name = node.getName()
                }
                return {
                    ...obj,
                    ['param-' + uuid]: {
                        key: param.getName(),
                        value: source ? connectItem(source, 'output', node, 'param-' + uuid, data, nodesData, edges, 'param-' + uuid) : '',
                        type: type
                    }
                }//
            }, {
                static: !!node.getModifiers().find(m => m.getKindName() == 'StaticKeyword'),
                async: !!node.getModifiers().find(m => m.getKindName() == 'AsyncKeyword'),
                level: level,
                type: node.getReturnTypeNode() ? node.getReturnTypeNode().getText() : null
            })
        }
    }

    component.dataOutput = DataOutput.method

    component.dump = (node, nodes, edges, nodesData, methodName, enableMarkers, dumpType, level = 0) => {
        const data = nodesData[node.id] ?? {};
        const name = methodType == 'constructor' ? 'constructor' : data.name
        const params = Object.keys(data).filter(key => key.startsWith('param')).map((param) => {
            let paramName = dumpConnection(node, "target", param + '-key', PORT_TYPES.data, data[param]?.key ?? "", edges, nodes, nodesData, null, enableMarkers, dumpType, level)
            const paramValue = dumpConnection(node, "target", param, PORT_TYPES.data, data[param]?.value ?? "", edges, nodes, nodesData, null, enableMarkers, dumpType, level)
            const objParam = paramName + (data[param].type ? ':' + data[param].type + ' ' : '') + (paramValue ? "=" + paramValue : "")
            return objParam
        })

        const body = dumpConnection(node, "target", "body", PORT_TYPES.flow, '', edges, nodes, nodesData, null, enableMarkers, dumpType, level)
        let total = (data.static ? 'static ' : '') + (data.async ? 'async ' : '') + name
        return total + "(" + params.join(',') + ") " + (data.type ? ':' + data.type + ' ' : '') + body + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, null, enableMarkers, dumpType, level)
    }
    return component
}

const MethodNode = MethodFactory('method')
export default React.memo(MethodNode)