import { Node, NodeParams, CustomFieldsList, FallbackPortList, getFieldValue, filterCallback, FlowPort, FallbackPort, restoreCallback} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Text } from 'tamagui';

const QueueEnqueue = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(11)
    const [type, setType] = useState()

    const params = [
        {
            "label": "Queue",
            "field": "param-1",
            "type": "input",
        },
        {
            "label": "data",
            "field": "param-2",
            "type": "input",
        },
    ]

    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Queue enqueue' color={color} id={node.id} skipCustom={true}>
            <div ref={paramsRef}>
                <NodeParams id={node.id} params={params} />
            </div>
        </Node>
    )
}


export default {
    id: 'QueueEnqueue',
    type: 'CallExpression',
    category: 'Utils',
    keywords: ['utils', 'queue', 'enqueue', 'add'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.utils.queueEnqueue')
    },
    getComponent: (node, nodeData, children) => <QueueEnqueue
     node={node} nodeData={nodeData} children={children} />,

    getInitialData: () => {
        return {
            to: 'context.utils.queueEnqueue',
            "param-1": {
                value: "",
                kind: "Identifier"
            },
            "param-2": {
                value: "",
                kind: "Identifier"
            },
        }
    }
}