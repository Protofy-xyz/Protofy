import React, { useContext } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, NodeParams } from '../Node';
import { generateId } from '../lib/IdGenerator';
import { FlowStoreContext } from "../store/FlowsStore";
import AddPropButton from '../AddPropButton';
import { DataOutput } from '../lib/types';
import { Combine } from 'lucide-react';
import { useNodeColor } from '../diagram/Theme';

const ObjectBindingPattern = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const nodeParams: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('param-')).map((param: any, i) => {
        return { label: param.substr(6), field: param, fieldType: 'parameter', deleteable: true } as Field
    })

    return (
        <Node icon={Combine} node={node} isPreview={!id} title={"object binding"} id={id} color={color} dataOutput = {DataOutput.binding}>
            <NodeParams id={id} params={nodeParams} />
            <AddPropButton id={id} nodeData={nodeData} />
        </Node>
    );
}
ObjectBindingPattern.keyWords = ["object","binding", "object binding"]

ObjectBindingPattern.getData = (node, data, nodesData, edges) => {
    return {
        ...node.getElements().reduce((obj, element, i) => {
            const uuid = generateId()
            const sourcePropertyName = element?.getPropertyNameNode()
            const sourceName = element?.getName() ?? ''
            const sourceInitializer = element?.getInitializer()
            var bindingObj = {}
            if(sourceInitializer){
                bindingObj = {
                    key: sourceName,
                    value: sourceInitializer.getText(),
                    initializer: true
                }
            } else if (sourcePropertyName) {
                bindingObj = {
                    key: sourcePropertyName.getText(),
                    value: sourceName,
                }
            } else {
                bindingObj = {
                    key: sourceName,
                }
            }
            return {
                ...obj,
                ['param-' + uuid]: {
                    ...bindingObj
                }
            }
        }, {
            // export: node.getModifiers().find(m => m.getKindName() == 'ExportKeyword')
        })
    }
}
ObjectBindingPattern.dataOutput = DataOutput.binding

ObjectBindingPattern.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id] ?? {};
    const params = Object.keys(data).filter(key => key.startsWith('param-')).reduce((total, param) => {
        let objKey = data[param].key
        const separator = data[param].initializer ? "=" : ':' 
        const objValue = dumpConnection(node, "target", param, PORT_TYPES.data, data[param]?.value??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        const objParam = objKey + (objValue ? (separator + objValue): "") + ", "
        return total + objParam 
    }, "")

    let total = '{' + params + "}" + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    return total 
}

export default ObjectBindingPattern