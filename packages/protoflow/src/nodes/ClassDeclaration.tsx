import React, { memo, useContext } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType, getTrivia } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import { isPortConnected } from '../lib/Edge';
import { FlowStoreContext } from "../store/FlowsStore";
import { Blocks } from '@tamagui/lucide-icons';
import { DataOutput } from '../lib/types';
import Button from '../Button';
import { useNodeColor } from '../diagram/Theme';

export const ClassFactory = (classType) => {
    const components = (node) => {
        const { id, type } = node
        const color = useNodeColor(type)
        const useFlowsStore = useContext(FlowStoreContext)
        const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
        const setNodeData = useFlowsStore(state => state.setNodeData)

        const memberArr = Object.keys(nodeData)?.filter(n => (n.startsWith('member-') || n.startsWith('param-')))
        const members: Field[] = memberArr?.map((member, i) => {
            //TODO: change deleteable to true (both) once delete nodes fixed
            if (member.startsWith('param-')) {
                return { field: member, type: 'input', fieldType: 'parameter', separator: '=', deleteable: false } as Field
            } else {
                return { label: `Member [${i}]`, field: member, type: 'input', deleteable: true } as Field
            }
        })
        const declarationParams: Field[] = [
            { label: 'Name', field: 'name', type: 'input', static: true } as Field,
        ]

        const nodeParams: Field[] = [
            { label: 'Extends', field: 'extends', type: 'input' } as Field,
            { label: 'Implements', field: 'implements', type: 'input' } as Field
        ].concat(members)

        const onAddParam = (type) => {
            if (type == 'attribute') {
                setNodeData(id, { ...nodeData, [`param-${memberArr.length}`]: { type: 'attribute', key: '', value: '' } })
            } else {
                setNodeData(id, { ...nodeData, [`member-${memberArr.length}`]: '' })
            }
        }

        return (
            <Node icon={Blocks} node={node} isPreview={!id} title={`class ${classType}`} id={id} color={color} dataOutput={DataOutput.flow}>
                {classType == 'declaration' ? <NodeParams id={id} params={declarationParams} /> : null}
                <NodeParams id={id} params={nodeParams} />
                <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                    <Button onPress={() => onAddParam('attribute')} label={`Add attribute`} style={{ width: '110px', margin: '0px' }} />
                    <Button onPress={() => onAddParam('member')} label={`Add member`} style={{ width: '110px', margin: '0px' }} />
                </div>
                <NodeParams id={id} params={[{ label: 'Export', field: 'export', type: 'boolean', static: true }]} />
                {nodeData.export ? <NodeParams id={id} params={[{ label: 'isDefault', field: 'isDefault', type: 'boolean', static: true }]} /> : null}
            </Node>
        );
    }
    components.keywords = ["class", 'structure', 'object oriented']
    components.category= "program structure"
    components.getData = (node, data, nodesData, edges) => {
        const members = node.getMembers().reduce((obj, param, i) => {
            var field = 'member-' + i
            var memberData = {}
            if (param.getKindName() == 'PropertyDeclaration') {
                var field = 'param-' + i
                const paramKey = param.getName()
                const typeNode = param.getTypeNode()
                const paramValue = param.getInitializer()?.getText() ?? ''
                const attrTriviaKey = `attrTrivia${i}`
                const attrTrivia = getTrivia(param)

                memberData[field] = { key: paramKey, value: paramValue }
                memberData[`type-${field}`] = typeNode ? typeNode.getText() : null
                memberData[attrTriviaKey] = attrTrivia

            } else { // MethodDeclaration | Constructor
                memberData[field] = connectItem(param, 'output', node, field, data, nodesData, edges, null, [PORT_TYPES.data, PORT_TYPES.data])
            }
            return { ...obj, ...memberData }
        }, {})

        const obj = {
            ...members,
            export: node.getModifiers().find(m => m.getKindName() == 'ExportKeyword'),
            isDefault: node.getModifiers ? (node.getModifiers().find(m => m.getText() == 'default') ? true : false) : false,
            name: node.getName()
        }

        const heritageClasues = node.getHeritageClauses();
        if (heritageClasues.length) {
            heritageClasues.forEach((cla, i) => {
                const clauseType = cla.getToken() == 117 ? 'implements' : 'extends'
                obj[clauseType] = connectItem(heritageClasues[0], 'output', node, clauseType, data, nodesData, edges, clauseType)
            })
        }

        return obj
    }
    components.dataOutput = DataOutput.flow
    components.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level = 0) => {
        const data = nodesData[node.id] ?? {};
        const body = Object.keys(data)?.filter(n => (n.startsWith('member-') || n.startsWith('param-'))).reduce((total, param, i) => {
            if (param.startsWith('param-')) {
                const paramKey = data[param].key ?? ''
                const paramValue = data[param].value
                const paramSymbol = data['type-' + param] && paramValue ? ':' : '='
                const attrTriviaKey = `attrTrivia${i}`

                return total + data[attrTriviaKey] + paramKey + (paramValue ? (paramSymbol + paramValue) : '')
            } else {
                if (isPortConnected(node.id, param, PORT_TYPES.data, edges)) {
                    return total + dumpConnection(node, "target", param, PORT_TYPES.data, '', edges, nodes, nodesData, data[param], enableMarkers, dumpType, level)
                }
                return total
            }
        }, '')

        return (data.export ? 'export ' : '')
            + (data.export && data.isDefault ? 'default ' : '')
            + 'class ' + (classType == 'declaration' ? data.name : '')
            + (data.extends ? ' extends ' + data.extends : '')
            + (data.implements ? ' implements ' + data.implements : '')
            + '{' + body + '}'
            + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    }
    return components
}

const ClassNode = ClassFactory('declaration')
export default memo(ClassNode)