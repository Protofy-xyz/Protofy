import { Node, Field, HandleOutput, NodeParams } from 'protoflow';
import { Reply } from 'lucide-react';

const ApiResponse = ({node= {}, nodeData= {}, children}: any) => {

    const nodeParams: Field[] = [
        { label: 'Response text', field: 'param1', type: 'input', static: true },
        
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
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('res.send'), //TODO: Change output function name
    getComponent: (node, nodeData, children) => <ApiResponse node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { to: 'res.send', param1: '"Response"' } }
}