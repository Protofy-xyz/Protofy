import React, { useContext } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import { nodeColors } from '.';
import { generateId } from '../lib/IdGenerator';
import { FlowStoreContext } from "../store/FlowsStore";
import AddPropButton from '../AddPropButton';
import { SyntaxKind } from "ts-morph";
import { MdOutlineCategory } from 'react-icons/md';
import { DataOutput } from '../lib/types';

const InterfaceDeclaration = (node) => {
    const { id, type } = node
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const name = [
        { label: 'Name', static: true, field: 'name', type: 'input', description: 'Interface name' },
    ] as Field[]
    const nodeParams: Field[] = name.concat(Object.keys(nodeData).filter((p) => p.startsWith('param-')).map((param: any, i) => {
        return { label: param.substr(6), field: param, fieldType: 'parameter', deleteable: true } as Field
    }))

    return (
        <Node icon={MdOutlineCategory} node={node} isPreview={!id} title={"interface"} id={id} color={nodeColors[type]} dataOutput = {DataOutput.flow}>
            <NodeParams id={id} params={[{ label: 'Export', field: 'export', type: 'boolean', static: true }]} />
            <NodeParams id={id} params={nodeParams} />
            <AddPropButton id={id} nodeData={nodeData} />
        </Node>
    );
}
InterfaceDeclaration.keyWords = ["interface"]

InterfaceDeclaration.getData = (node, data, edges) => {
    return {
        ...node.getType().getProperties().reduce((obj, property, i) => {
            const uuid = generateId()
            const sourceValue = property.getValueDeclaration().getType().getText()
            const isOptional = !!property.getValueDeclaration()?.getChildrenOfKind(SyntaxKind.QuestionToken).length
            const sourceKey = property.getName() + (isOptional ? "?" : "")

            return {
                ...obj,
                ['param-' + uuid]: {
                    key: sourceKey ?? '',
                    value: sourceValue ?? ''
                }
            }
        }, {
            name: node.getName ? node.getName() : '',
            export: node.getModifiers().find(m => m.getKindName() == 'ExportKeyword')
        })
    }
}
InterfaceDeclaration.dataOutput = DataOutput.flow
InterfaceDeclaration.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id] ?? {};
    const params = Object.keys(data).filter(key => key.startsWith('param-')).reduce((total, param) => {
        let objKey = data[param].key
        const objValue = dumpConnection(node, "target", param, PORT_TYPES.data, data[param]?.value??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        const objParam = "\t"+objKey + ":" + objValue + ";"
        return total + objParam + "\n" 
    }, "")

    let total = (data.export ? 'export ' : '') + ' interface ' + data.name + " {\n" + params + "\n}"
    return total + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default React.memo(InterfaceDeclaration)



