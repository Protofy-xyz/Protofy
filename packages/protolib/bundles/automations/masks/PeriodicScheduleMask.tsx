import { Node, FlowPort, NodeParams, FallbackPort, filterCallback, restoreCallback, getFieldValue } from 'protoflow';
import WeekdayPicker from 'protoflow/src/fields/WeekdayPicker'
import { usePrimaryColor } from 'protoflow/src/diagram/Theme'
import { Timer } from 'lucide-react';
import NodeText from 'protoflow/src/diagram/NodeText';


const PeriodicScheduleMask = ({ node = {}, nodeData = {}, children }: any) => {
    const primaryColor = usePrimaryColor()

    return (
        <Node icon={Timer} node={node} isPreview={!node.id} title='Periodic Schedule' color={primaryColor} id={node.id} skipCustom={true} disableInput disableOutput>
            <div style={{ padding: '8px 15px 8px 15px', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <NodeText
                    style={{width: 'fit-content', height: 'fit-content', marginBottom: '5px'}}
                >Time</NodeText>
                <WeekdayPicker node={node} nodeData={nodeData} item={{ type: 'time', field: {
                    hours: 'param-1', 
                    minutes: 'param-2'
                }}} />
                <br/>
                <NodeText
                    style={{width: 'fit-content', height: 'fit-content', marginBottom: '5px'}}
                >Days</NodeText>
                <WeekdayPicker node={node} nodeData={nodeData} item={{ type: 'days', field: {
                    days: 'param-3'
                }}} />
            </div>
            <div style={{ position: 'relative', paddingBottom: '50px' }}>
                <FlowPort id={node.id} type='input' label='Execute' style={{bottom: '0px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param-4'} type={"target"} fallbackPort={'request'} portType={"_"} preText="async () =>" postText="" />
            </div>
        </Node>
    )
}

export default {
    id: 'periodicScheduleMask',
    type: 'CallExpression',
    category: 'timers',
    keywords: ['timers', 'event', 'trigger', 'setInterval', 'schedule', 'timer', 'wait', 'sleep'],
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && nodeData.to == 'context.createPeriodicSchedule'
            && (getFieldValue("param-4",nodeData)?.startsWith('async () =>') || getFieldValue("param-4",nodeData)?.startsWith('() =>'))
        )
    },
    getComponent: (node, nodeData, children) => <PeriodicScheduleMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => {
        return {
            "to": 'context.createPeriodicSchedule',
            "param-1": { value: '13', kind: "StringLiteral" }, // hours
            "param-2": { value: '00', kind: "StringLiteral" }, // minutes
            "param-3": { value: '', kind: "StringLiteral" }, // days
            "param-4": { value: "async () =>", kind: "Identifier" }, // callb
        }
    },
    filterChildren: filterCallback("4"),
    restoreChildren: restoreCallback("4"),
} 