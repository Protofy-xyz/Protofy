import { Node, FlowPort, NodeParams, FallbackPort, filterCallback, restoreCallback} from 'protoflow';
import {useColorFromPalette} from 'protoflow/src/diagram/Theme'
import { Timer } from 'lucide-react';

const CronMask = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(55)
    return (
        <Node icon={Timer} node={node} isPreview={!node.id} title='Cron ' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Cron expression', field: 'param1', type: 'input' }]} />
            <div style={{ paddingBottom: "80px" }}>
                <FlowPort id={node.id} type='input' label='Execute' style={{ top: '140px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param2'} type={"target"}x fallbackPort={'request'} portType={"_"} preText="() => " postText="" />
            </div>
        </Node>
    )
}

//context, cb, path?, from?

export default {
    id: 'cronMask',
    type: 'CallExpression',
    category: 'timers',
    keywords: ['timers', 'event', 'trigger', 'setInterval', 'timer', 'wait', 'sleep', 'cron'],
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && nodeData.to == 'context.createCronJob'
            && nodeData.param1 && nodeData.param2
            && (nodeData.param2.startsWith('() =>'))
        )
    },
    getComponent: (node, nodeData, children) => <CronMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'context.createCronJob', param1: '"* * * * * *"' , param2: '() =>' } },
    filterChildren: filterCallback("1"),
    restoreChildren: restoreCallback("1"),
}