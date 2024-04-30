import { Node, NodeOutput, NodeParams, filterObject, restoreObject } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme';
import { Globe } from 'lucide-react';

const ResolveDNS = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(8)
    return (
        <Node icon={Globe} node={node} isPreview={!node.id} title='Resolve DNS' color={color} id={node.id} skipCustom={true} style={{ minWidth: '250px' }}>
            <NodeParams id={node.id} params={[
                { label: 'Hostname', field: 'mask-hostname', type: 'input' },
                { label: 'RRType', field: 'mask-rrtype', type: 'select', data: ['A', 'AAAA', 'ANY', 'CAA', 'CNAME', 'MX', 'NAPTR', 'NS', 'PTR', 'SOA', 'SRV', 'TXT'] }
            ]} />
            <div style={{ height: '30px' }} />
            <NodeOutput id={node.id} type={'input'} label={'Done'} vars={['records']} handleId={'mask-done'} />
            <NodeOutput id={node.id} type={'input'} label={'Error'} vars={['err']} handleId={'mask-error'} />
        </Node>
    )
}

export default {
    id: 'network.resolveDNS',
    type: 'CallExpression',
    category: "Network",
    keywords: ['dns', 'network', 'resolve', 'hostname'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.network.resolveDNS')
    },
    getComponent: (node, nodeData, children) => <ResolveDNS node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({
        keys: {
            'hostname': 'input',
            'rrtype': 'input',
            done: 'output',
            error: 'output'
        }
    }),
    restoreChildren: restoreObject({
        keys: {
            'hostname': 'input',
            'rrtype': 'input',
            done: { params: { 'param-done': { key: "records" } } },
            error: { params: { 'param-error': { key: "err" } } }
        }
    }),
    getInitialData: () => {
        return {
            await: true,
            to: 'context.network.resolveDNS',
            "mask-hostname": {
                value: "",
                kind: "StringLiteral"
            },
            "mask-rrtype": {
                value: "A",
                kind: "StringLiteral"
            }
        }
    }
}
