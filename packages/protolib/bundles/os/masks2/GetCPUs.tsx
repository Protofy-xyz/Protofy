import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Cpu } from 'lucide-react';

const GetCPUs = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(8)
    return (
        <Node icon={Cpu} node={node} isPreview={!node.id} title='Get CPUs' color={color} id={node.id} skipCustom={true} style={{minWidth: '250px'}}>
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['cpus', 'count']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'os2.getCPUs',
    type: 'CallExpression',
    category: "OS",
    keywords: ['os', 'system', 'cpus', 'hardware', 'monitor'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os2.getCPUs')
    },
    getComponent: (node, nodeData, children) => <GetCPUs node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            done: 'output',
            error: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        done: { params: {'param-cpus': { key: "cpus"}, 'param-count': { key: "count"}}},
        error: { params: { 'param-error': { key: "err"}}}
    }}),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.os2.getCPUs',
        }
    }
}
