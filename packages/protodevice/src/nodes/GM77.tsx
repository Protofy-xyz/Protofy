import { Field, Node, NodeParams } from 'protoflow';
import { getColor } from ".";

const GM77 = ({ node = {}, nodeData = {}, children, color }: any) => {
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input',
        },
        {
            label: 'UART bus name', static: true, field: 'param-2', type: 'input'
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='QR Sensor' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}
export default {
    id: 'GM77',
    type: 'CallExpression',
    category: "sensors",
    keywords: ["sensor", "qr", "barcode", "gm77", "gm73"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('gm77'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <GM77 color={getColor('GM77')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => {
        return {
            to: 'gm77',
            "param-1": { value: "", kind: "StringLiteral" },
            "param-2": { value: "", kind: "StringLiteral" }
        }
    }
}
