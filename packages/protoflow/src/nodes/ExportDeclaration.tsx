import React, { useContext } from 'react';
import { dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field } from '../Node';
import { FlowStoreContext } from "../store/FlowsStore";
import { FileSymlink } from '@tamagui/lucide-icons';
import { DataOutput } from '../lib/types';
import { useNodeColor } from '../diagram/Theme';

const ExportDeclaration =(node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})

    const nodeParams:Field[] = Object.keys(nodeData).filter(key=>key.startsWith('export-')).map((key, i) => {
        return { label: i+1+"", field: key, type: 'input', static: true }
    }) as Field[]

    return (
        <Node icon={FileSymlink} node={node} isPreview={!id} title={"export"} id={id} params={nodeParams} color={color} dataOutput={DataOutput.flow}/>
    );
}
ExportDeclaration.category = "module system"
ExportDeclaration.keywords = ["export"]
ExportDeclaration.getData = (node, data, edges) => {
    const elements = node.getNamedExports() ?? []

    return elements.reduce((obj, param, i) =>{
        const key = 'export-'+i
        return {...obj, [key]: param.getName()}//
    },{})
}
ExportDeclaration.dataOutput = DataOutput.flow

ExportDeclaration.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id] ?? {};
    const params = Object.keys(data).filter(key => key.startsWith('export')).reduce((total, exprt) => {
        return total += dumpConnection(node, "target", exprt, PORT_TYPES.data, data[exprt]??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)+', '
    }, "")
    return 'export {'+params+'}'
}

export default React.memo(ExportDeclaration)



