import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Split } from '@tamagui/lucide-icons';
import { filterCallback, restoreCallback } from 'protoflow';

const GetStateMachine = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(10)

    return (
        <Node icon={Split} node={node} isPreview={!node.id} title='Get State Machine' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Instance name', field: 'mask-instanceName', type: 'input' }]} />
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['result']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'sm.getStateMachine',
    type: 'CallExpression',
    category: "StateMachines",
    keywords: ["machine", "state machine", "state", "get", "read"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.sm.getStateMachine')
    },
    getComponent: (node, nodeData, children) => <GetStateMachine node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            instanceName: 'input', 
            done: 'output',
            error: 'output',
    }}),
    restoreChildren: restoreObject({keys: {
        instanceName: 'input',
        done: { params: { 'param-done': { key: "result"}, 'param-output': { key: "output"}}}, 
        error: { params: { 'param-error': { key: "err"}, 'param-output': { key: "output"}}},
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.sm.getStateMachine',
            "mask-instanceName": {
              value: "",
              kind: "StringLiteral"
          }
        }
    }
}
