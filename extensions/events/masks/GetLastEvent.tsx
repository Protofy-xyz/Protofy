import { Node, NodeParams } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from '@tamagui/lucide-icons';

const GetLastEventMask = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(50)
    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Get Last Event' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={[{ label: 'Filters {path?, from?, user?}', field: 'param-1', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Await', field: 'await', type: 'boolean', static: true }]} />
        </Node>
    )
}

export default {
    id: 'getLastEventMask',
    type: 'CallExpression',
    category: "events",
    keywords: ["event", 'last', 'device', 'get'],
    check: (node, nodeData) => {
        return node.type == "CallExpression"
            && nodeData.to == 'context.getLastEvent'
    },
    getComponent: (node, nodeData, children) => <GetLastEventMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'context.getLastEvent', "param-1": { value: '{path: "services/api/start"}', kind: "Identifier" } } }
}