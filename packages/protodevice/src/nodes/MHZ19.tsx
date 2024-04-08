import { Node, Field, NodeParams } from 'protoflow';
import { getColor } from '.';

const MHZ19 = ({ node = {}, nodeData = {}, children, color }: any) => {
    const transitionErrorMsg = 'Add units s/ms'
    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param-1', type: 'input' },
        {
            label: 'UART bus name', static: true, field: 'param-2', type: 'input',
        },
        {
            label: 'Update Interval', static: true, field: 'param-3', type: 'input',
            error: !['s', 'ms'].includes(nodeData['param-3']?.value?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='MH-Z19' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default {
    id: 'MHZ19',
    type: 'CallExpression',
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('mhz19'),
    getComponent: (node, nodeData, children) => <MHZ19 color={getColor('MHZ19')} node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'mhz19', "param-1": { value: "", kind: "StringLiteral" }, "param-2": { value: "", kind: "StringLiteral" }, "param-3": { value: "30s", kind: "StringLiteral" } } }
}
