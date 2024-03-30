import React, { memo, useContext } from 'react';
import { dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import AddPropButton from '../AddPropButton';
import Node, { Field, NodeParams } from '../Node';
import { FlowStoreContext } from "../store/FlowsStore";
import { FileInput } from 'lucide-react';
import { DataOutput } from '../lib/types';
import { useNodeColor } from '../diagram/Theme';

const ImportDeclaration = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})

    const named: Field[] = Object.keys(nodeData).filter(key => key.startsWith('import-')).map((key, i) => {
        return { label: i + 1 + "", field: key, type: 'input', static: true, deleteable: true }
    }) as Field[]

    //@ts-ignore
    const nodeParams: Field[] = [
        { label: 'Module', field: 'module', type: 'input', static: true },
        { label: 'Default', field: 'default', type: 'input', static: true } as Field
    ].concat(named)

    return (
        <Node icon={FileInput} node={node} isPreview={!id} title='import' id={id} color={color} dataOutput = {DataOutput.flow}>
            <NodeParams id={id} params={nodeParams} boxStyle={{ marginTop: '10px' }} />
            <AddPropButton id={id} nodeData={nodeData} type={"Import"} style={{marginBottom: '20px'}}/>
        </Node>
    );
}
ImportDeclaration.category = "module system"
ImportDeclaration.keyWords = ['import']
ImportDeclaration.getData = (node, data, edges) => {
    const elements = node.getNamedImports() ?? []
    return elements.reduce((obj, param, i) => {
        const key = 'import-' + i
        return { ...obj, [key]: param.getName() }//
    }, {
        'default': node.getDefaultImport()?.getText(),
        'module': node.getModuleSpecifier()?.getText().slice(1, -1)
    })
}
ImportDeclaration.dataOutput = DataOutput.flow
ImportDeclaration.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id]??{};
    const namedImports = Object.keys(data).filter(key => key.startsWith('import')).reduce((total, imprt) => {
        return data[imprt]?(total += (dumpConnection(node, "target", imprt, PORT_TYPES.data, data[imprt]??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level) + ', ')):total
    }, "")
    const defaultImport = dumpConnection(node, "target", "default", PORT_TYPES.data, data?.default??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level) ?? ''
    const module = dumpConnection(node, "target", "module", PORT_TYPES.data, data?.module??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    const defaultSeparator = defaultImport && namedImports ? ', ' : ''
    const namedImportsContent = namedImports ? '{ ' + namedImports + '}' : ''
    return 'import ' + defaultImport + defaultSeparator + namedImportsContent + ` from "${module}"`+dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

export default memo(ImportDeclaration)