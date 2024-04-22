import { Node, NodeParams, CustomFieldsList, FallbackPortList, filterCallback, FlowPort, FallbackPort, restoreCallback } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from 'lucide-react';
import { useRef } from 'react';

const ChildProcessSpawn = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(10)

    const params = [
        {
            "label": "command",
            "field": "param-1",
            "type": "input"
        },
        {
            "label": "[args]",
            "field": "param-2",
            "type": "input"
        },
        {
            "label": "{options}",
            "field": "param-3",
            "type": "input"
        }
    ]
    const fallbacks = [
        {
            "name": "stdout",
            "label": "stdout OnData (data)",
            "field": "param-4",
            "preText": "async (data) => ",
            "postText": "",
            "fallbackText": "null",
            "type": "output"
        },
        {
            "name": "stderr",
            "label": "stderr OnData (data)",
            "field": "param-5",
            "preText": "async (data) => ",
            "postText": "",
            "fallbackText": "null",
            "type": "output"
        },
        {
            "name": "close",
            "label": "OnClose (code)",
            "field": "param-6",
            "preText": "async (code) => ",
            "postText": "",
            "fallbackText": "null",
            "type": "output"
        },
        {
            "name": "error",
            "label": "onError (err)",
            "field": "param-7",
            "preText": "async (err) => ",
            "postText": "",
            "fallbackText": "null",
            "type": "output"
        }
    ]

    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Spawn process' color={color} id={node.id} skipCustom={true}>
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
    id: 'ChildProcessSpawn',
    type: 'CallExpression',
    category: 'OS',
    keywords: ['executor', 'os', 'command', 'spawn', 'process'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os.spawn')
    },
    getComponent: (node, nodeData, children) => <ChildProcessSpawn node={node} nodeData={nodeData} children={children} />,
    filterChildren: (node, childScope, edges) => {
        childScope = filterCallback("4", "stdout")(node, childScope, edges)
        childScope = filterCallback("5", "stderr")(node, childScope, edges)
        childScope = filterCallback("6", "close")(node, childScope, edges)
        childScope = filterCallback("7", "error")(node, childScope, edges)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("4")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("5")(node, result.nodes, originalNodes, result.edges, originalEdges)
        result = restoreCallback("6")(node, result.nodes, originalNodes, result.edges, originalEdges)
        result = restoreCallback("7")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getInitialData: () => {
        return {
            to: 'context.os.spawn',
            "param-1": {
                value: "",
                kind: "StringLiteral"
            },
            "param-2": {
                value: "[]",
                kind: "Identifier"
            },
            "param-3": {
                value: "{}",
                kind: "Identifier"
            },
            "param-4": {
                value: "null",
                kind: "Identifier"
            },
            "param-5": {
                value: "null",
                kind: "Identifier"
            },
            "param-6": {
                value: "null",
                kind: "Identifier"
            },
            "param-7": {
                value: "null",
                kind: "Identifier"
            }
        }
    }
}