import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from ".";


const ODrive = ({ node = {}, nodeData = {}, children, color }: any) => {
    const nodeParams: Field[] = [
        {
            label: 'Name', static: true, field: 'param-1', type: 'input',
        },
        {
            label: 'UART bus name', static: true, field: 'param-2', type: 'input'
        },
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='ODrive motor' color={color} id={node.id} skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'ODrive',
    type: 'CallExpression',
    category: "actuators",
    keywords: ["brushless", "motor","driver", "ODrive", "device"],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('odrive'),
    getComponent: (node, nodeData, children) => <ODrive color={getColor('odrive')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'odrive', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" }}}
}