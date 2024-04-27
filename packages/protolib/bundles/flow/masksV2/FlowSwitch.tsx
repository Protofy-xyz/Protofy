import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Split } from 'lucide-react';
import { filterCallback, restoreCallback } from 'protoflow';
import {operations} from '../context/flowSwitch'

const FlowSwitch = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(10)
    return (
        <Node icon={Split} node={node} isPreview={!node.id} title='Flow Switch' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Condition', field: 'mask-condition', type: 'input' }]} />
            <div style={{height: '50px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Then'} handleId={'mask-then'} />
            <NodeOutput id={node.id} type={'input'} label={'Else'} handleId={'mask-otherwise'} />
            <NodeOutput id={node.id} type={'input'} label={'Finally'} handleId={'mask-after'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} handleId={'mask-error'} />
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
    filterChildren: filterObject({keys: {
            condition: 'input',
            then: 'output',
            otherwise: 'output',
            after: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        condition: 'input',
        then: {
            params: {
                'param-a': {
                    key: "a"
                },
                'param-b': {
                    key: "b"
                }
            }
        },
        otherwise: 'output',
        after: 'output',
        error: 'output'
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.flow2.switch',
            "param-1": {
                value: "{}",
                kind: "Identifier"
            }
        }
    }
}
