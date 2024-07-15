import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Clock } from '@tamagui/lucide-icons';

const GetSystemUptime = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(8)
    return (
        <Node icon={Clock} node={node} isPreview={!node.id} title='System Uptime' color={color} id={node.id} skipCustom={true} style={{minWidth: '250px'}}>
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['uptime']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.getSystemUptime',
    type: 'CallExpression',
    category: "OS",
    keywords: ['os', 'system', 'uptime', 'time'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.getSystemUptime')
    },
    getComponent: (node, nodeData, children) => <GetSystemUptime node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        done: { params: {'param-done': { key: "uptime"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.getSystemUptime',
        }
    }
}
