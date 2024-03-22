import { Node, Field, HandleOutput, NodeParams } from 'protoflow';

const Mqtt = ({node= {}, nodeData= {}, children}: any) => {

    const nodeParams: Field[] = [
        { label: 'Broker', field: 'param1', type: 'input', static: true },
        { label: 'Port', field: 'param2', type: 'input', static: true },
    ] as Field[]
    
    return (
        <Node node={node} isPreview={!node.id} title='Mqtt' color="#FFDF82" id={node.id} skipCustom={true} disableInput disableOutput>
            <NodeParams id={node.id} params={nodeParams} />
        </Node>
    )
}

export default Mqtt