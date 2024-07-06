import { Node, FlowPort, NodeParams, FallbackPort, filterCallback, restoreCallback, getFieldValue } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Timer } from 'lucide-react';

const SetTimeoutMask = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(55)
    return (
        <Node icon={Timer} node={node} isPreview={!node.id} title='Timer' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Wait time (ms)', field: 'param-2', type: 'input' }]} />
            <div style={{ paddingBottom: "80px" }}>
                <FlowPort id={node.id} type='input' label='On Timer' style={{ top: '140px' }} handleId={'request'} />
                <FallbackPort node={node} fallbackText="null" port={'param-1'} type={"target"} fallbackPort={'request'} portType={"_"} preText="async () => " postText="" />
            </div>
        </Node>
    )
}

//context, cb, path?, from?

export default {
    id: 'setTimeoutMask',
    type: 'CallExpression',
    category: 'timers',
    keywords: ['timers', 'event', 'trigger', 'setTimeout', 'wait', 'sleep'],
    check: (node, nodeData) => {
        var param1Val = getFieldValue('param-1', nodeData)
        return node.type == "CallExpression" && nodeData.to == 'setTimeout' && (!param1Val || param1Val == "null" || param1Val?.startsWith('async () =>') || param1Val?.startsWith('() =>'))
    },
    getComponent: (node, nodeData, children) => <SetTimeoutMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'setTimeout', "param-1": { value: 'null', kind: "Identifier" }, "param-2": { value: 1000, kind: 'NumericLiteral' } } },
    filterChildren: filterCallback("1"),
    restoreChildren: restoreCallback("1"),
}