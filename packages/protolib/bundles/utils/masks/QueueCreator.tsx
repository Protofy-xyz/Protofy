import { Node, NodeParams, CustomFieldsList, FallbackPortList, filterCallback, FlowPort, FallbackPort, restoreCallback} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { useRef } from 'react';

const QueueCreator = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(11)

    const params = [
        {
            "label": "Type",
            "field": "param-1",
            "type": "select",
            "data":["fifo", "lifo", "priority", "delayed"]
        }
    ]
    const fallbacks = [
        {
            "name": "itemEnqueued",
            "label": "onItemEnqueued (item)",
            "field": "param-2",
            "preText": "async (item) => ",
            "postText": "",
            "fallbackText": "null",
            "type": "output"
        },
        {
            "name": "itemDequeued",
            "label": "onItemDequeued (item)",
            "field": "param-3",
            "preText": "async (item) => ",
            "postText": "",
            "fallbackText": "null",
            "type": "output"
        },
        {
            "name": "queueEmpty",
            "label": "onQueueEmpty",
            "field": "param-4",
            "preText": "async () => ",
            "postText": "",
            "fallbackText": "null",
            "type": "output"
        }
    ]


    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Queue' color={color} id={node.id} skipCustom={true}>
            <div ref={paramsRef}>
                <NodeParams id={node.id} params={params} />
            </div>
            <div>
                <FallbackPortList node={node} fallbacks={fallbacks} startPosX={paramsRef?.current?.clientHeight} />
            </div>
        </Node>
    )
}

export default {
    id: 'QueueCreator',
    type: 'CallExpression',
    category: 'Utils',
    keywords: ['utils', 'queue', 'creat', 'generat'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.utils.queueCreator')
    },
    getComponent: (node, nodeData, children) => <QueueCreator
     node={node} nodeData={nodeData} children={children} />,

    filterChildren: (node, childScope, edges) => {
        childScope = filterCallback("2", "itemEnqueued")(node, childScope, edges)
        childScope = filterCallback("3", "itemDequeued")(node, childScope, edges)
        childScope = filterCallback("4", "queueEmpty")(node, childScope, edges)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("2")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("3")(node, result.nodes, originalNodes, result.edges, originalEdges)
        result = restoreCallback("4")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getInitialData: () => {
        return {
            to: 'context.utils.queueCreator',
            "param-1": {
                value: "fifo",
                kind: "StringLiteral"
            },
            "param-2": {
                value: "",
                kind: "Identifier"
            },
            "param-3": {
                value: "",
                kind: "Identifier"
            },
            "param-4": {
                value: "",
                kind: "Identifier"
            },
        }
    }
}