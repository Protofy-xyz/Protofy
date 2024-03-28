import { Node, Field, FlowPort, NodeParams, FallbackPort, Button } from 'protoflow';
import { API } from 'protolib'
import { Plug } from 'lucide-react';

const Fecth = (node: any = {}, nodeData = {}) => {
    const nodeParams: Field[] = [{ label: 'Type', field: 'to', type: 'select', data: ['API.get', 'API.post'], static: true }]
    return (
        <Node icon={Plug} node={node} isPreview={!node?.id} title='Fetch' id={node.id} color="#A5D6A7" skipCustom={true}>
            <NodeParams id={node.id} params={nodeParams} />
            <NodeParams id={node.id} params={[{ label: 'Path', field: 'param1', type: 'input'}]} />
            {
                nodeData?.to == 'API.post' && <NodeParams id={node.id} params={[{ label: 'Body', field: 'param2', type: 'input'}]} />
            }
        </Node>
    )
}

export default Fecth