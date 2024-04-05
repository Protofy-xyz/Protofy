import { Node, FlowPort, NodeParams, FallbackPort, filterCallback, restoreCallback } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Timer } from 'lucide-react';

const ScheduleMask = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(55)
    return (
        <Node icon={Timer} node={node} isPreview={!node.id} title='Schedule' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Time', field: 'param-1', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Day', field: 'param-3', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Month', field: 'param-4', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Year', field: 'param-5', type: 'input' }]} />
            <div style={{ paddingBottom: '80px' }}>
                <FlowPort id={node.id} type='input' label='Execute' style={{ top: '300px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param-2'} type={"target"} fallbackPort={'request'} portType={"_"} preText="async () =>" postText="" />
            </div>
        </Node>
    )
}

//context, cb, path?, from?

export default {
    id: 'scheduleMask',
    type: 'CallExpression',
    category: 'timers',
    keywords: ['timers', 'event', 'trigger', 'setInterval', 'schedule', 'timer', 'wait', 'sleep'],
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && nodeData.to == 'context.createSchedule'
            && nodeData["param-1"] && nodeData["param-5"]
            && nodeData["param-3"] && nodeData["param-4"]
            && nodeData["param-2"]
            && (nodeData["param-2"]?.startsWith('async () =>') || nodeData["param-2"]?.startsWith('() =>'))
        )
    },
    getComponent: (node, nodeData, children) => <ScheduleMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => {
        return {
            "to": 'context.createSchedule',
            "param-1": { value: "12:30", kind: "StringLiteral" },
            "param-2": { value: "async () =>", kind: "Identifier" },
            "param-3": { value: "5", kind: "StringLiteral" },
            "param-4": { value: "april", kind: "StringLiteral" },
            "param-5": { value: "2024", kind: "StringLiteral" },
        }
    },
    filterChildren: filterCallback(),
    restoreChildren: restoreCallback(),
} 