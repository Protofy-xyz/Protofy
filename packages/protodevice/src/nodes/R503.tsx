import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from '.';

const R503 = ({ node = {}, nodeData = {}, children, color }: any) => {
    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param-1', type: 'input' },
        {
            label: 'UART bus name', static: true, field: 'param-2', type: 'input',
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='Fingerprint reader' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'R503',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["uart","R503", "finger", "access"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('r503'),
    getComponent: (node, nodeData, children) => <R503 color={getColor('R503')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'r503', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" } } }
}
