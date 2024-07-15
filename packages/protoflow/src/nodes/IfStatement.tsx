import React, { memo, useContext } from 'react';
import Node, { Field, FlowPort, NodeParams } from '../Node';
import { connectItem, dumpConnection, getId, PORT_TYPES, DumpType } from '../lib/Node';
import { Split } from '@tamagui/lucide-icons';
import { FlowStoreContext } from "../store/FlowsStore";
import { DataOutput } from '../lib/types';
import useTheme, { useNodeColor } from '../diagram/Theme';

const minBlockHeight = 260

const IfStatement = (node) => {
    const { id, type } = node
    const color = useNodeColor(type)
    const nodeParams: Field[] = [
        { label: 'Condition', field: 'condition', type: 'input' },
    ]

    const nodeFontSize = useTheme('nodeFontSize')

    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const metaData = useFlowsStore(state => state.nodeData[id] && state.nodeData[id]['_metadata'] ? state.nodeData[id]['_metadata'] : {childHeight:0, childHeights:[]})
    
    const getConnectedNodeMeta = (handle, portType) => metaData.childHeights.find(c => c.node?.edge?.targetHandle == id+portType+handle)

    const getBlockHeight = () => {
        if(!id) return
        if(!metaData.childHeight) return minBlockHeight
        const condition = getConnectedNodeMeta("condition", PORT_TYPES.data)
        const then = getConnectedNodeMeta("then", PORT_TYPES.flow)

        return (Math.max(minBlockHeight, ((condition?condition.height:0)+(then?Math.min(nodeFontSize*10, then.height):0)))) //getSizeOfLastChild(metaData.childHeights)+headerSize
    }

    const getConnectedPos = (handle, defaultValue) => {
        const n = getConnectedNodeMeta(handle, PORT_TYPES.flow)
        if(n) {
            return n.delta.y + nodeFontSize*2
        }
        return defaultValue
    }


    const blockHeight = getBlockHeight()
    return (
        <Node style={{minHeight:blockHeight+'px'}} icon={Split} node={node} isPreview={!id} title={!id?'if' : 'if ( '+nodeData.condition+' )'} id={id} color={color} dataOutput={DataOutput.flow}>
            <NodeParams id={id} params={nodeParams} boxStyle={{ marginTop: '0px', marginBottom: '20px' }} />
            <FlowPort id={id} type='input' label='Then' style={{ top: getConnectedPos('then', nodeFontSize*8)+'px' }} handleId={'then'} />
            <FlowPort id={id} type='input' label='Else' style={{ top: Math.max(0, blockHeight-nodeFontSize)+'px'}} handleId={'else'} />
        </Node>
    );
}

IfStatement.keywords = ['if', 'conditional', 'condition']
IfStatement.category = 'conditionals'
IfStatement.getData = (node, data, nodesData, edges) => {
    const nodeId = getId(node);
    const thenId = data[getId(node.getThenStatement())]?.value?.id
    const elseId = data[getId(node.getElseStatement())]?.value?.id
    if(thenId) {
        connectItem(thenId, 'output', node, 'then', data, nodesData, edges, null, [PORT_TYPES.data, PORT_TYPES.flow])
    }
    if(elseId){
        connectItem(elseId, 'output', node, 'else', data, nodesData, edges, null, [PORT_TYPES.data, PORT_TYPES.flow])
    }
    return {
        condition: connectItem(node.getExpression(), 'output', node, 'condition', data, nodesData, edges, 'condition')
    }
}
IfStatement.dataOutput = DataOutput.flow
IfStatement.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
    const data = nodesData[node.id];
    const condition = dumpConnection(node, "target", "condition", PORT_TYPES.data, data?.condition??"", edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    const body = dumpConnection(node, "target", "then", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    const elseBody = dumpConnection(node, "target", "else", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
    let elseData = ''
    if(elseBody) {
        elseData = " else \n"+elseBody
    }
    return "if("+condition+")\n" + body + "\n" + elseData + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
}

IfStatement.getChildPosition = (node, childPos, originalPos, childNode, type) => {
    if(childNode.edge.targetHandle == node.id+PORT_TYPES.flow+'then' && node.position.y == childPos.y) {
        childPos.y += 120
    }
    return childPos
}

export default memo(IfStatement)