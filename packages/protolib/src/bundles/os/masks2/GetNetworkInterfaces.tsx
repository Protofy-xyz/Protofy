import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme';
import { Network } from '@tamagui/lucide-icons';

const GetNetworkInterfaces = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(8)
    return (
        <Node icon={Network} node={node} isPreview={!node.id} title='Network Interfaces' color={color} id={node.id} skipCustom={true} style={{minWidth: '250px'}}>
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['interfaces']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.getNetworkInterfaces',
    type: 'CallExpression',
    category: "OS",
    keywords: ['os', 'system', 'network', 'interfaces', 'info'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.getNetworkInterfaces')
    },
    getComponent: (node, nodeData, children) => <GetNetworkInterfaces node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        done: { params: {'param-done': { key: "interfaces"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.getNetworkInterfaces',
        }
    }
}
