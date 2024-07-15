import { Node, Field, HandleOutput, NodeParams } from 'protoflow';
import { Reply } from '@tamagui/lucide-icons';

const AutomationResponse = ({ node = {}, nodeData = {}, children }: any) => {

    const nodeParams: Field[] = [
        { label: 'Response', field: 'param-2', type: 'input'}
    ] as Field[]

    return (
        <Node icon={Reply} node={node} isPreview={!node.id} title='Automation Response' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'AutomationResponse',
    type: 'CallExpression',
    category: "automation",
    keywords: ["api", "rest", "http", "trigger", "automation", 'response'],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('context.automationResponse'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <AutomationResponse node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'context.automationResponse', "param-1": { value: "res", kind: "Identifier"} , "param-2": { value: "Automation executed", kind: "StringLiteral" }  }}
}