import React, { useContext } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, HandleOutput, NodeParams } from '../Node';
import AddPropButton from '../AddPropButton';
import { FlowStoreContext } from "../store/FlowsStore";
import { CopyPlus } from '@tamagui/lucide-icons';
import { useNodeColor } from '../diagram/Theme';

const NewExpression =(node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const params:Field[] = Object.keys(nodeData).filter(key => key.startsWith('param')).map((param, i) => {
        return { label: `Params[${i + 1}]`, field: param, type: 'input', deleteable: true } as Field
    }) as Field[]
    
    //@ts-ignore
    const nodeParams: Field[] = [{ label: 'Name', field: 'name', type: 'input', }].concat(params)
    const nodeOutput: Field = { label: 'Output', field: 'value', type: 'output' }

    return (
        <Node icon={CopyPlus} output={{ label: 'Output', field: 'value', type: 'output' }} node={node} isPreview={!id} title={"new"} id={id}  color={color}>
            <NodeParams id={id} params={nodeParams} boxStyle={{ marginTop: '10px' }} />
            <AddPropButton id={id} nodeData={nodeData} type={"param"}/>
            <HandleOutput id={id} param={nodeOutput} />
        </Node>
    );
}
NewExpression.category = 'operators'
NewExpression.keywords = ["new"]
NewExpression.getData = (node, data, nodesData, edges) => {
    return {
        ...node.getArguments().reduce((obj, param, i) =>{
            return {...obj, ['param'+(i+1)]: connectItem(param, 'output', node, 'param'+(i+1), data, nodesData, edges, 'param'+(i+1))}
        },{}),
        name: connectItem(node.getExpression(), 'output', node, 'name', data, nodesData, edges, 'name')
    }
}

NewExpression.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id] ?? {};
    const params = Object.keys(data).filter(key => key.startsWith('param')).map(param => dumpConnection(node, "target", param, PORT_TYPES.data, data[param]??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level))
    const name = dumpConnection(node, "target", "name", PORT_TYPES.data, data.name, edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    return 'new '+name+'('+params.join(',')+")"+dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}


export default React.memo(NewExpression)
