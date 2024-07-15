import { Node, NodeParams, CustomFieldsList, FallbackPortList, filterCallback, FlowPort, FallbackPort} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from '@tamagui/lucide-icons';
import { useRef } from 'react';

const CreateFolder = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(14)

    const params = [
        {
            "label": "path",
            "field": "param-1",
            "type": "output"
        }
    ]


    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Create folder' color={color} id={node.id} skipCustom={true}>
            <div ref={paramsRef}>
                <NodeParams id={node.id} params={params} />
            </div>
        </Node>
    )
}

export default {
    id: 'CreateFolder',
    type: 'CallExpression',
    category: 'OS',
    hidden: true,
    keywords: ['fs', 'os', 'make', 'dir', 'mkdir'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os.createFolder')
    },
    getComponent: (node, nodeData, children) => <CreateFolder node={node} nodeData={nodeData} children={children} />,

    getInitialData: () => {
        return {
            to: 'context.os.createFolder',
            "param-1": {
                value: "",
                kind: "StringLiteral"
            }
        }
    }
}