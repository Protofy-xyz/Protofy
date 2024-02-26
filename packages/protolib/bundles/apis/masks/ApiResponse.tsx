import { Node, Field, HandleOutput, NodeParams } from 'protoflow';

const ApiResponse = ({node= {}, nodeData= {}, children}: any) => {

    const nodeParams: Field[] = [
        { label: 'Response text', field: 'param1', type: 'input', static: true },
        
    ] as Field[]
    
    return (
        <Node node={node} isPreview={!node.id} title='Api Response' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default ApiResponse