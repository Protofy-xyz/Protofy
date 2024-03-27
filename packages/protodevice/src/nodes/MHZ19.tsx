import {Node, Field, NodeParams } from 'protoflow';

const MHZ19 = ({node = {}, nodeData = {}, children, color}: any) => {
    const transitionErrorMsg = 'Add units s/ms'
    const nodeParams: Field[] = [
        { label: 'Name', static: true, field: 'param1', type: 'input' },
        {
            label: 'UART bus name', static: true, field: 'param2', type: 'input',
        },
        {
            label: 'Update Interval', static: true, field: 'param3', type: 'input',
            error: !['s', 'ms'].includes(nodeData['param3']?.replace(/['"0-9]+/g, '')) ? transitionErrorMsg : null
        }
    ] as Field[]
    return (
        <Node node={node} isPreview={!node.id} title='MH-Z19' color={color} id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default MHZ19
