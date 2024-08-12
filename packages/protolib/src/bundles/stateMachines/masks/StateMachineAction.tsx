import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Split } from '@tamagui/lucide-icons';
import { filterCallback, restoreCallback } from 'protoflow';
import { useEffect, useState } from 'react';

const StateMachineAction = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(10)

    return (
        <Node icon={Split} node={node} isPreview={!node.id} title='State Machine Action' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Instance name', field: 'mask-instanceName', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Action', field: 'mask-emitType', type: 'input'}]} />
            <NodeParams id={node.id} params={[{ label: 'Payload', field: 'mask-payload', type: 'input'}]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['result']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'sm.stateMachineAction',
    type: 'CallExpression',
    category: "StateMachines",
    keywords: ["machine", "state machine", "state", "action", "emit"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.sm.emitToStateMachine')
    },
    getComponent: (node, nodeData, children) => <StateMachineAction node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            instanceName: 'input', 
            emitType: 'input', 
            payload: 'input', 
            done: 'output',
            error: 'output',
    }}),
    restoreChildren: restoreObject({keys: {
        instanceName: 'input',
        emitType: 'input',
        payload: 'input',
        done: { params: { 'param-done': { key: "result"}, 'param-output': { key: "result"}}}, 
        error: { params: { 'param-error': { key: "err"}, 'param-output': { key: "err"}}},
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.sm.emitToStateMachine',
            "mask-instanceName": {
              value: "",
              kind: "StringLiteral"
            }, 
            "mask-emitType": {
              value: "",
              kind: "StringLiteral"
            }
        }
    }
}
