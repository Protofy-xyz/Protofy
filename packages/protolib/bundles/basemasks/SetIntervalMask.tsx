import { Node, FlowPort, NodeParams, FallbackPort, filterCallback, restoreCallback} from 'protoflow';
import {useColorFromPalette} from 'protoflow/src/diagram/Theme'
import { Timer } from 'lucide-react';

const SetIntervalMask = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(55)
    return (
        <Node icon={Timer} node={node} isPreview={!node.id} title='Interval timer' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Interval time (ms)', field: 'param2', type: 'input' }]} />
            <div style={{ paddingBottom: "80px" }}>
                <FlowPort id={node.id} type='input' label='On Timer' style={{ top: '140px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param1'} type={"target"}x fallbackPort={'request'} portType={"_"} preText="() => " postText="" />
            </div>
        </Node>
    )
}

//context, cb, path?, from?

export default {
    id: 'setIntervalMask',
    type: 'CallExpression',
    category: 'timers',
    keywords: ['timers', 'event', 'trigger', 'setInterval', 'timer', 'wait', 'sleep'],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'setInterval' &&  (nodeData.param1?.startsWith('async () =>') || nodeData.param1?.startsWith('() =>')),
    getComponent: (node, nodeData, children) => <SetIntervalMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'setInterval', param1: '() =>' , param2: 1000 } },
    filterChildren: filterCallback("1"),
    restoreChildren: restoreCallback("1"),
}