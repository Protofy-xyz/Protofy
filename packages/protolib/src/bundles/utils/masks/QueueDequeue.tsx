import { Node, NodeParams, CustomFieldsList, FallbackPortList, filterCallback, FlowPort, FallbackPort, restoreCallback} from 'protoflow';
import { useColorFromPalette } from 'protoflow/dist/diagram/Theme'
import { Cable } from '@tamagui/lucide-icons';
import { useRef } from 'react';

const QueueDequeue = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(11)

    const params = [
        {
            "label": "Queue",
            "field": "param-1",
            "type": "input",
        },
    ]


    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Queue dequeue' color={color} id={node.id} skipCustom={true}>
            <div ref={paramsRef}>
                <NodeParams id={node.id} params={params} />
            </div>
        </Node>
    )
}

export default {
    id: 'QueueDequeue',
    type: 'CallExpression',
    category: 'Utils',
    keywords: ['utils', 'queue', 'dequeue', 'remove'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.utils.queueDequeue')
    },
    getComponent: (node, nodeData, children) => <QueueDequeue
     node={node} nodeData={nodeData} children={children} />,

    getInitialData: () => {
        return {
            to: 'context.utils.queueDequeue',
            "param-1": {
                value: "",
                kind: "Identifier"
            },
        }
    }
}