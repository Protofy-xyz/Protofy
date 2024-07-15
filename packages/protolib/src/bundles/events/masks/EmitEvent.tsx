import { Node, NodeParams } from 'protoflow';
import { Plug } from '@tamagui/lucide-icons';

const emitEvent = (node: any = {}, nodeData = {}) => {
    return (
        <Node icon={Plug} node={node} isPreview={!node?.id} title='Emit Event' id={node.id} color="#A5D6A7" skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Path', field: 'param-1', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'From', field: 'param-2', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'User', field: 'param-3', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Payload', field: 'param-4', type: 'input' }]} />
        </Node>
    )
}

export default {
    id: 'emitEvent',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && (nodeData.to == 'context.emitEvent')
        )
    },
    getComponent: emitEvent,
    category: "events",
    keywords: ["generateEvent", "emit", "event"],
    getInitialData: () => {
        return { to: 'context.emitEvent', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "api", kind: "StringLiteral" }, "param-3": { value: "system", kind: "StringLiteral" }, "param-4": { value: "{}", kind: "ObjectLiteralExpression", await: true } }
    }
}