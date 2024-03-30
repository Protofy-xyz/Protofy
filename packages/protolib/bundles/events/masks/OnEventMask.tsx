import { Node, FlowPort, NodeParams, FallbackPort, filterCallback, restoreCallback} from 'protoflow';
import {useColorFromPalette} from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';

const OnEventMask = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(55)
    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='On Event' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Event Path', field: 'param3', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'From', field: 'param4', type: 'input' }]} />
            <div style={{ paddingBottom: "30px" }}>
                <FlowPort id={node.id} type='input' label='On Event (event)' style={{ top: '170px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param2'} type={"target"} fallbackPort={'request'} portType={"_"} preText="(event) => " postText="" />
            </div>
        </Node>
    )
}

//context, cb, path?, from?

export default {
    id: 'onEventMask',
    type: 'CallExpression',
    category: "automation",
    keywords: ["automation", 'event', 'trigger'],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'context.onEvent' && nodeData.param4 != '"device"' && nodeData.param4 != "'device'",
    getComponent: (node, nodeData, children) => <OnEventMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'context.onEvent', param1: 'context', param2: '(event) =>' , param3: '""', param4: '""' } },
    filterChildren: filterCallback(),
    restoreChildren: restoreCallback(),
}