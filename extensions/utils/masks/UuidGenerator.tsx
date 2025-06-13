import { Node, NodeParams, CustomFieldsList, FallbackPortList, filterCallback, FlowPort, FallbackPort} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from '@tamagui/lucide-icons';
import { useRef } from 'react';

const UuidGenerator = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(8)

    const params = [
        {
            "label": "Verison",
            "field": "param-1",
            "type": "select",
            "data":["v1", "v4", "NIL"]
        }
    ]


    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Generate UUID' color={color} id={node.id} skipCustom={true}>
            <div ref={paramsRef}>
                <NodeParams id={node.id} params={params} />
            </div>
        </Node>
    )
}

export default {
    id: 'UuidGenerator',
    type: 'CallExpression',
    category: 'Utils',
    keywords: ['utils', 'random', 'id', 'uuid', 'generat'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.utils.uuidGenerator')
    },
    getComponent: (node, nodeData, children) => <UuidGenerator
     node={node} nodeData={nodeData} children={children} />,

    getInitialData: () => {
        return {
            to: 'context.utils.uuidGenerator',
            "param-1": {
                value: "v4",
                kind: "StringLiteral"
            },
        }
    }
}