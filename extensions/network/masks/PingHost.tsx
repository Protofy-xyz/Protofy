import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Activity } from '@tamagui/lucide-icons';

const PingHost = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(8)
    return (
        <Node icon={Activity} node={node} isPreview={!node.id} title='Ping Host' color={color} id={node.id} skipCustom={true} style={{ minWidth: '250px' }}>
            <NodeParams id={node.id} params={[
                { label: 'Hostname', field: 'mask-hostname', type: 'input' }
            ]} />
            <div style={{ height: '30px' }} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['result']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'network.pingHost',
    type: 'CallExpression',
    category: "Network",
    keywords: ['ping', 'network', 'connectivity', 'hostname'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.network.pingHost')
    },
    getComponent: (node, nodeData, children) => <PingHost node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({
        keys: {
            'hostname': 'input',
            done: 'output',
            error: 'output'
        }
    }),
    restoreChildren: restoreObject({
        keys: {
            'hostname': 'input',
            done: { params: { 'param-done': { key: "result" } } },
            error: { params: { 'param-error': { key: "err" } } }
        }
    }),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.network.pingHost',
            "mask-hostname": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}
