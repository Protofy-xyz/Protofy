import { Node, Field, HandleOutput, NodeParams } from 'protoflow';
import { Reply } from '@tamagui/lucide-icons';

const ApiResponse = ({ node = {}, nodeData = {}, children }: any) => {

    const nodeParams: Field[] = [
        { label: 'Response', field: 'param-1', type: 'input'}
    ] as Field[]

    return (
        <Node icon={Reply} node={node} isPreview={!node.id} title='Api Response' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'res.send',
    type: 'CallExpression',
    category: "api",
    keywords: ["api", "rest", "http", "trigger", "automation", 'response'],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'res.send', //TODO: Change output function name
    getComponent: (node, nodeData, children) => <ApiResponse node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'res.send', "param-1": { value: "Response", kind: "StringLiteral" } } }
}