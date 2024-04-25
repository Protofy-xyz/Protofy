import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { filterCallback, restoreCallback } from 'protoflow';
import {operations} from '../context/flowSwitch'

const FlowSwitch = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(10)
    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Flow Switch (2)' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Condition', field: 'mask-condition', type: 'input' }]} />
            <div style={{height: '50px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Then'} handleId={'mask-then'} />
            <NodeOutput id={node.id} type={'input'} label={'Else'} handleId={'mask-otherwise'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} handleId={'mask-error'} />
            <NodeOutput id={node.id} type={'input'} label={'Finally'} handleId={'mask-after'} />
        </Node>
    )
}
export default {
    id: 'flowSwitchV2',
    type: 'CallExpression',
    category: "Flow",
    keywords: ["control", "filter", "switch", "flow", "conditional"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.flow2.switch')
    },
    getComponent: (node, nodeData, children) => <FlowSwitch node={node} nodeData={nodeData} children={children} />,
    filterChildren: (node, childScope, edges, nodeData, setNodeData) => {
        childScope = filterConnection("param-1", (id, nodeData, setNodeData) => {
            const objData = nodeData[id]
            if(objData) {
                Object.keys(objData).forEach(key => {
                    if(key.startsWith('param-')) {
                        setNodeData(getId(node), {
                            ...nodeData[getId(node)],
                            ['mask-'+objData[key].key]: { value: objData[key].value, kind: objData[key].kind ?? 'Identifier'}
                        })
                        //get the edges that are connected to the node at the port in objData[key]
                        let edge = edges.find(e => e.targetHandle == id+'-'+key)
                        if(edge) {
                            if(edge.source.startsWith('ArrowFunction_')) {
                                edge = edges.find(e => e.targetHandle == edge.source+'_call')
                                if(edge) {
                                    edge.target = getId(node)
                                    edge.targetHandle = getId(node) + (objData[key].key == 'condition' ? "-" : '_') + 'mask-'+objData[key].key
                                }
                            }
                            edges.push(connectNodes(edge.source, edge.sourceHandle, getId(node), getId(node) + (objData[key].key == 'condition' ? "-" : '_') + 'mask-'+objData[key].key))
                        }
                    }

                })
            }
        })(node, childScope, edges, nodeData, setNodeData)
        return childScope
    },
    getInitialData: () => {
        return {
            to: 'context.flow2.switch',
            "param-1": {
                value: "{}",
                kind: "Identifier"
            }
        }
    }
}
