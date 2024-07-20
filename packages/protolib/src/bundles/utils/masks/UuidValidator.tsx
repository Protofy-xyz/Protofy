import { Node, NodeParams, CustomFieldsList, FallbackPortList, filterCallback, FlowPort, FallbackPort} from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme'
import { Cable } from '@tamagui/lucide-icons';
import { useRef } from 'react';

const UuidValidator = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(9)

    const params = [
        { label: "UUID", field: "param-1", type: "input"}
    ]


    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Validate UUID' color={color} id={node.id} skipCustom={true}>
            <div ref={paramsRef}>
                <NodeParams id={node.id} params={params} />
            </div>
        </Node>
    )
}

export default {
    id: 'UuidValidator',
    type: 'CallExpression',
    category: 'Utils',
    keywords: ['utils', 'random', 'id', 'uuid', 'valid'],
    check: (node, nodeData) => node.type == "CallExpression" && nodeData.to?.startsWith('context.utils.uuidValidator'),
    getComponent: (node, nodeData, children) => <UuidValidator node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => {
        return {
            to: 'context.utils.uuidValidator',
            "param-1": {
                value: "",
                kind: "StringLiteral"
            },
        }
    }
}