import { Node, Field, HandleOutput, NodeParams } from 'protoflow';
import { Reply } from 'lucide-react';

const ApiResponseFile = ({ node = {}, nodeData = {}, children }: any) => {

    const nodeParams: Field[] = [
        { label: 'Path', field: 'param-1', type: 'input'},
        { label: '{Options}', field: 'param-2', type: 'input'}
    ] as Field[]

    return (
        <Node icon={Reply} node={node} isPreview={!node.id} title='Api Response File' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'res.sendFile',
    type: 'CallExpression',
    category: "api",
    keywords: ["api", "rest", "http", "trigger", "automation", 'response'],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'res.sendFile', //TODO: Change output function name
    getComponent: (node, nodeData, children) => <ApiResponseFile node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'res.sendFile', "param-1": { value: "path", kind: "StringLiteral" }, "param-2": { value: "{ root: '../../data/'}", kind: "Identifier" }} }
}