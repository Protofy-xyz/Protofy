import React, { memo } from 'react';
import { connectItem, dumpConnection, PORT_TYPES, DumpType } from '../lib/Node';
import Node, { Field, FlowPort, NodeParams } from '../Node';
import { Repeat } from 'lucide-react';
import { DataOutput } from '../lib/types';
import useTheme, { useNodeColor } from '../diagram/Theme';

export const LoopFactory = (mode, submode='') =>{
    const Loop = (node) => {
        const fontNodeSize = useTheme('nodeFontSize')
        const { id, type } = node
        const color = useNodeColor(type)
        const nodeParams: Field[] = []
        if(mode == 'for') {
            nodeParams.push({ label: 'Initializer', field: 'initializer', type: 'input' })
        }
        nodeParams.push({ label: 'Condition', field: 'condition', type: 'input' })
        if(mode == 'for') {
            nodeParams.push({ label: 'Incrementor', field: 'incrementor', type: 'input' })
        }
        return (
            <Node icon={Repeat} node={node} isPreview={!id} title={submode ? submode : mode} id={id} color={color} dataOutput = {DataOutput.flow}>
                <NodeParams id={id} params={nodeParams} boxStyle={{ marginTop: '0px', marginBottom: fontNodeSize*3+'px' }} />
                <FlowPort id={id} type='input' label='Loop' style={{ top: mode=='for' ? (fontNodeSize*11):(fontNodeSize*6.5)+'px' }} handleId={'loop'} />
            </Node>
        );
    }
    Loop.keywords = ['for', 'while', 'do-while', 'loop', 'iterator', 'iterate', 'for each', 'repeat']
    Loop.category = "loops"
    Loop.getData = (node, data, nodesData, edges) => {

        if(node.getStatement()) {
            connectItem(node.getStatement(), 'output', node, 'loop',  data, nodesData, edges, null, [PORT_TYPES.data, PORT_TYPES.flow])
        }

        let obj = {}
        if(mode == 'for') {
            obj = {
                initializer: connectItem(node.getInitializer(), 'output', node, 'initializer', data, nodesData, edges, 'initializer'),
                incrementor: connectItem(node.getIncrementor(), 'output', node, 'incrementor', data, nodesData, edges, 'incrementor')
            }
        }
        return {
            ...obj,
            condition: connectItem(mode == 'while'? node.getExpression() : node.getCondition(), 'output', node, 'condition', data, nodesData, edges, 'condition'),
            mode: mode,
            submode: submode
        }
    }
    Loop.dataOutput = DataOutput.flow
    Loop.dump = (node, nodes, edges, nodesData, metadata = null, enableMarkers = false, dumpType: DumpType = "partial", level=0) => {
        const data = nodesData[node.id];
        const condition = dumpConnection(node, "target", "condition", PORT_TYPES.data, data?.condition, edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        const loop = dumpConnection(node, "target", "loop", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        let loopCode;
        if(node.type == 'WhileStatement') {
            loopCode = "while("+condition+") "+loop
        } else if(node.type == 'DoStatement') {
            loopCode = "do "+loop+" while ("+condition+")"
        } else if(node.type == 'ForStatement') {
            const initializer = dumpConnection(node, "target", "initializer", PORT_TYPES.data, data?.initializer, edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
            const incrementor = dumpConnection(node, "target", "incrementor", PORT_TYPES.data, data?.incrementor, edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
            loopCode = "for("+initializer.replace(/;$/, '')+";"+condition.replace(/;$/, '')+";"+incrementor.replace(/;$/, '')+") "+loop
            // initializer.slice(0,-2) because "initializer" gets the ";"
        }

        return loopCode + dumpConnection(node, "source", "output", PORT_TYPES.flow, '', edges, nodes, nodesData, metadata, enableMarkers, dumpType, level)
        
    }
    return Loop
}

export default memo(LoopFactory('while'))