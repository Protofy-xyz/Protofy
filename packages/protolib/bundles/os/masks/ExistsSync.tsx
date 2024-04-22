import { Node, NodeParams, CustomFieldsList, FallbackPortList, filterCallback, FlowPort, FallbackPort} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { useRef } from 'react';

const PathExists = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(12)

    const params = [
        {
            "label": "path",
            "field": "param-1",
            "type": "output"
        }
    ]


    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Path exists' color={color} id={node.id} skipCustom={true}>
            <div ref={paramsRef}>
                <NodeParams id={node.id} params={params} />
            </div>
        </Node>
    )
}

export default {
    id: 'PathExists',
    type: 'CallExpression',
    category: 'OS',
    keywords: ['fs', 'os', 'exist', 'file'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os.pathExists')
    },
    getComponent: (node, nodeData, children) => <PathExists node={node} nodeData={nodeData} children={children} />,

    getInitialData: () => {
        return {
            to: 'context.os.pathExists',
            "param-1": {
                value: "",
                kind: "StringLiteral"
            },
        }
    }
}