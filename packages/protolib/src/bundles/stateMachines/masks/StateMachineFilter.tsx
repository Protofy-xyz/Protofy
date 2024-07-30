import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Split } from '@tamagui/lucide-icons';
import { filterCallback, restoreCallback } from 'protoflow';
import { useEffect, useState } from 'react';
import { SMDefinitionsRepository } from '../repository';

const StateMachineFilter = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(10)

    return (
        <Node icon={Split} node={node} isPreview={!node.id} title='State Machine filter' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Instance name', field: 'mask-instanceName', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'State', field: 'mask-state', type: 'input' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Then'} handleId={'mask-then'} />
            <NodeOutput id={node.id} type={'input'} label={'Else'} handleId={'mask-otherwise'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'sm.stateMachineFilter',
    type: 'CallExpression',
    category: "StateMachines",
    keywords: ["machine", "state machine", "state", "filter"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.sm.stateMachineFilter')
    },
    getComponent: (node, nodeData, children) => <StateMachineFilter node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            instanceName: 'input', 
            state: 'input', 
            then: 'output',
            otherwise: 'output',
            error: 'output',
    }}),
    restoreChildren: restoreObject({keys: {
        instanceName: 'input',
        state: 'input',
        then: { params: {'param-output': { key: "output"}}},
        otherwise: { params: {'param-output': { key: "output"}}},
        error: { params: { 'param-error': { key: "err"}, 'param-output': { key: "output"}}},
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.sm.stateMachineFilter',
            "mask-instanceName": {
                value: "",
                kind: "StringLiteral"
            }, 
            "mask-state": {
              value: "",
              kind: "StringLiteral"
          }
        }
    }
}
