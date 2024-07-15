import { Node, FlowPort, NodeParams, FallbackPort, filterCallback, restoreCallback, getFieldValue } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Timer } from '@tamagui/lucide-icons';

const OnRenderMask = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(55)
    
    return (
        <Node icon={Timer} node={node} isPreview={!node.id} title='On Render' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <div style={{ width: '300px', paddingBottom: "80px" }}>
                <FlowPort id={node.id} type='input' label='On Render' style={{ top: '80px' }} handleId={'request'} />
                <FallbackPort node={node} port={'param-1'} type={"target"} fallbackPort={'request'} portType={"_"} preText={"async () => "} postText="" />
            </div>
        </Node>
    )
}

//context, cb, path?, from?

export default {
    id: 'OnRenderMask',
    type: 'CallExpression',
    category: 'UI Events',
    keywords: ['trigger', 'ui', 'onrender'],
    check: (node, nodeData) => {
        var param1Val = getFieldValue('param-1', nodeData)
        return (
            node.type == "CallExpression" && nodeData.to == 'context.onRender'
            && param1Val?.startsWith
            && (param1Val?.startsWith('async () =>') || param1Val?.startsWith('() =>'))
    )},
    getComponent: (node, nodeData, children) => <OnRenderMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'context.onRender', "param-1": { value: 'async () =>', kind: "Identifier" } } },
    filterChildren: filterCallback("1"),
    restoreChildren: restoreCallback("1"),
}