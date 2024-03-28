import { Node, NodeParams } from 'protoflow';
import { Plug } from 'lucide-react';

const Fecth = (node: any = {}, nodeData = {}) => {
    return (
        <Node icon={Plug} node={node} isPreview={!node?.id} title='Fetch' id={node.id} color="#A5D6A7" skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Method', field: 'param1', type: 'select', data: ["\"get\"", "\"post\""], static: true }]} />
            <NodeParams id={node.id} params={[{ label: 'Path', field: 'param2', type: 'input'}]} />
            {
                nodeData?.param1 == "\"post\"" && <NodeParams id={node.id} params={[{ label: 'Body', field: 'param4', type: 'input'}]} />
            }
            <NodeParams id={node.id} params={[{ label: 'Has Token', field: 'param3', type: 'boolean'}]} />
        </Node>
    )
}

export default Fecth