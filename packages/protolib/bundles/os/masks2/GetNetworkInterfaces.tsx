import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Network } from 'lucide-react';

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
            networkInterfaces: 'output',
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        networkInterfaces: { params: {'param-networkInterfaces': { key: "networkInterfaces"}}},
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
