import { Node, NodeParams, CustomFieldsList, FallbackPortList, filterCallback, FlowPort, FallbackPort} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from '@tamagui/lucide-icons';
import { useRef } from 'react';

const UuidVersion = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(10)

    const params = [
        { label: "UUID", field: "param-1", type: "input"}
    ]


    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='UUID version' color={color} id={node.id} skipCustom={true}>
            <div ref={paramsRef}>
                <NodeParams id={node.id} params={params} />
            </div>
        </Node>
    )
}

export default {
    id: 'UuidVersion',
    type: 'CallExpression',
    category: 'Utils',
    keywords: ['utils', 'random', 'id', 'uuid', 'version'],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('context.utils.uuidVersion'),
    getComponent: (node, nodeData, children) => <UuidVersion node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => {
        return {
            to: 'context.utils.uuidVersion',
            "param-1": {
                value: "",
                kind: "StringLiteral"
            },
        }
    }
}