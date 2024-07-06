import { Node, NodeOutput, FallbackPort, NodeParams, filterConnection, getId, connectNodes, filterObject, restoreObject} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Key } from 'lucide-react'

const GetServiceToken = ({ node = {}, nodeData = {}, children }: any) => {
    const color = useColorFromPalette(11)
    return (
        <Node icon={Key} node={node} isPreview={!node.id} title='Get Service Token' color={color} id={node.id} skipCustom={true} style={{minWidth: '250px'}}>
            <div style={{height: '30px'}} />
            <NodeOutput id={node.id} type={'input'} label={'On Read'} vars={['key']} handleId={'mask-done'} />
        </Node>
    )
}

export default {
    id: 'getServiceToken',
    type: 'CallExpression',
    category: "System",
    keywords: ["key", "api", "token", "service", "get", "secret", "gettoken"],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.getServiceToken')
    },
    getComponent: (node, nodeData, children) => <GetServiceToken node={node} nodeData={nodeData} children={children} />,
    filterChildren: filterObject({keys: {
            done: 'output'
    }}),
    restoreChildren: restoreObject({keys: {
        done: { params: {'param-done': { key: "key"}}}
    }}),
    getInitialData: () => {
        return {
            await: false,
            to: 'context.getServiceToken'
        }
    }
}
