import React, { useContext } from 'react';
import { dumpConnection, PORT_TYPES, DumpType, connectItem } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import { FlowStoreContext } from "../store/FlowsStore";
import AddPropButton from '../AddPropButton';
import { Shapes } from 'lucide-react';
import { DataOutput } from '../lib/types';
import { useNodeColor } from '../diagram/Theme';

const TypeAliasDeclaration = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const name = [
        { label: 'Name', static: true, field: 'name', type: 'input', description: 'Type name' },
    ] as Field[]
    const nodeParams: Field[] = name.concat(Object.keys(nodeData).filter((p) => p.startsWith('union-')).map((param: any, i) => {
        return { label: '[' + i + ']', field: param, type: 'input', deleteable: true } as Field
    }))
    return (
        <Node icon={Shapes} node={node} isPreview={!id} title={(nodeData.export ? 'export ' : '') + "type " + (nodeData.name ?? '')} id={id} color={color} dataOutput={DataOutput.flow}>
            <NodeParams id={id} params={[{ label: 'Export', field: 'export', type: 'boolean', static: true }]} />
            <NodeParams id={id} params={nodeParams} />
            <AddPropButton id={id} nodeData={nodeData} type='Union'/>
        </Node>
    );
}
TypeAliasDeclaration.category = "type system"
TypeAliasDeclaration.keyWords = ["type"]

TypeAliasDeclaration.getData = (node, data, nodesData, edges) => {
    var typeAliasData: Object = {
        name: node.getName ? node.getName() : '',
        export: node.getModifiers().find(m => m.getKindName() == 'ExportKeyword')
    }
    var unions = []
    node.forEachChild(child => {
        if (child.getKindName() == 'TypeLiteral') {
            unions.push(child)
        } else if (child.getKindName() == 'UnionType') {
            child.forEachChild((union, i) => {
                unions.push(union)
            })
        }
    })
    unions.forEach((union, i) => {
        const unionKey = 'union-' + i
        typeAliasData = {
            ...typeAliasData,
            [unionKey]: connectItem(union, 'output', node, unionKey, data, nodesData, edges, null)
        }
    })
    return typeAliasData
}
TypeAliasDeclaration.dataOutput = DataOutput.flow
TypeAliasDeclaration.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level = 0) => {
    const data = nodesData[node.id] ?? {};
    const unionsArr = Object.keys(data).filter(key => key.startsWith('union-'))
    const unionsLenght = unionsArr.length
    const unions = unionsArr.reduce((total, param, index) => {
        const union = dumpConnection(node, "target", param, PORT_TYPES.data, data[param] ?? "", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        return total + union + (index + 1 < unionsLenght ? " | " : '\n')
    }, "")
    let total = (data.export ? 'export ' : '') + 'type ' + data.name + " = " + unions + " " + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    return total
}

export default React.memo(TypeAliasDeclaration)