import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Split } from '@tamagui/lucide-icons';
import { filterCallback, restoreCallback } from 'protoflow';

const OnStateMachineEvent = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(10)

    return (
        <Node icon={Split} node={node} isPreview={!node.id} title='On State Machine Event' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Instance name', field: 'mask-instanceName', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'State', field: 'mask-state', type: 'input' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'On Event'} vars={['event']} handleId={'mask-onEventCb'} />
        </Node>
    )
}

export default {
    id: 'sm.onStateMachineEvent',
    type: 'CallExpression',
    category: "StateMachines",
    keywords: ["machine", "state machine", "state", "get", "event"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.sm.onStateMachineEvent')
    },
    getComponent: (node, nodeData, children) => <OnStateMachineEvent node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            context: 'input', 
            mqtt: 'input', 
            instanceName: 'input', 
            state: 'input', 
            onEventCb: 'output',
    }}),
    restoreChildren: restoreObject({keys: {
        context: 'input',
        mqtt: 'input',
        instanceName: 'input',
        state: 'input',
        onEventCb: { params: { 'param-onEventCb': { key: "event"}}},
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.sm.onStateMachineEvent',
            "mask-instanceName": {
              value: "",
              kind: "StringLiteral"
            }, 
            "mask-state": {
              value: "",
              kind: "StringLiteral"
            }, 
            "mask-context": {
              value: 'context',
              kind: "Identifier"
            },
            "mask-mqtt": {
              value: 'context.mqtt',
              kind: "Identifier"
            }, 
        }
    }
}
