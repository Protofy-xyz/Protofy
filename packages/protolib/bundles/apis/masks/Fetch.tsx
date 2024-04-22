import { Node, NodeParams, FlowPort, FallbackPort} from 'protoflow';
import { Plug } from 'lucide-react';

const Fetch = (node: any = {}, nodeData = {}) => {
    return (
        <Node icon={Plug} node={node} isPreview={!node?.id} title='Fetch' id={node.id} color="#A5D6A7" skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Method', field: 'param-1', type: 'select', data: ["get", "post"], static: true }]} />
            <NodeParams id={node.id} params={[{ label: 'Path', field: 'param-2', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Post Data', field: 'param-3', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Use service token', field: 'param-6', type: 'boolean' }]} />
            <div style={{ marginTop: "120px" }}>
                <FlowPort id={node.id} type='output' label='On Response (data)' style={{ top: '300px' }} handleId={'then'} />
                <FallbackPort fallbackText="null" node={node} port={'param-4'} type={"target"} fallbackPort={'then'} portType={"_"} preText="async (data) => " postText="" />
                <FlowPort id={node.id} type='output' label='On Error (error)' style={{ top: '350px' }} handleId={'error'} />
                <FallbackPort fallbackText="null" node={node} port={'param-5'} type={"target"} fallbackPort={'error'} portType={"_"} preText="async (error) => " postText="" />
            </div>

        </Node>
    )
}

export default {
    id: 'Fetch',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && (nodeData.to == 'context.fetch')
        )
    },
    getComponent: Fetch,
    category: "api",
    keywords: ["api", "rest", "http", "automation", 'fetch', 'get', 'post'],
    getInitialData: () => {
        return {
            to: 'context.fetch',
            "param-1": { value: "get", kind: "StringLiteral" },
            "param-2": { value: "/api/v1/", kind: "StringLiteral" },
            "param-3": { value: "null", kind: "Identifier" },
            "param-4": { value: "null", kind: "Identifier" },
            "param-5": { value: "null", kind: "Identifier" },
            "param-6": { value: false, kind: "FalseKeyword" }
        }
    }
}