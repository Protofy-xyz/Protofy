import { Node, NodeParams, FlowPort, FallbackPort, FallbackPortList, filterCallback, restoreCallback } from 'protoflow';
import { ClipboardList } from '@tamagui/lucide-icons';
import { useEffect, useState } from 'react';
import { API } from 'protobase'
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'

const objectList = (node: any = {}, nodeData = {}) => {
    const [objects, setObjects] = useState<any[]>([]);
    const color = useColorFromPalette(1)

    const getObjects = async () => {
        const { data } = await API.get('/adminapi/v1/objects?all=1')
        setObjects(data?.items.map((item: any) => item.name));
    }

    useEffect(() => {
        if(node.id) getObjects()
    }, [])

    return (
        <Node icon={ClipboardList} node={node} isPreview={!node?.id} title='Object List' id={node.id} color={color} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Object', field: 'param-1', type: 'select', static: true, data: objects }]} />
            <NodeParams id={node.id} params={[{ label: 'Page', field: 'param-2', type: 'input' }]} />
            <NodeParams id={node.id} params={[{ label: 'Page size', field: 'param-3', type: 'input' }]} />
            <FallbackPortList 
                height='70px'
                node={node} 
                fallbacks={[{
                    "name": "onlist",
                    "label": "OnList (items, numPages, totalItems)",
                    "field": "param-6",
                    "preText": "async (items, numPages, totalItems) => ",
                    "postText": "",
                    "fallbackText": "null"
                }, {
                    "name": "onerror",
                    "label": "OnError (error)",
                    "field": "param-7",
                    "preText": "async (error) => ",
                    "fallbackText": "null",
                    "postText": ""
                }]} 
                startPosX={170}
            />
        </Node>
    )
}

export default {
    id: 'objectList',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && (nodeData.to == 'context.object.list')
        )
    },
    getComponent: objectList,
    category: "Objects (CMS)",
    keywords: ["list", "cms", "object"],
    filterChildren: (node, childScope, edges) => {
        childScope = filterCallback("6", "onlist")(node, childScope, edges)
        childScope = filterCallback("7", "onerror")(node, childScope, edges)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("6")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("7")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getInitialData: () => {
        return {
            to: 'context.object.list',
            "param-1": { value: "", kind: "StringLiteral" },
            "param-2": { value: "0", kind: "NumericLiteral" },
            "param-3": { value: "50", kind: "NumericLiteral" },
            "param-4": { value: "context.objects", kind: "Identifier" },
            "param-5": { value: "null", kind: "Identifier" },
            "param-6": { value: "null", kind: "Identifier" },
            "param-7": { value: "null", kind: "Identifier" }
        }
    }
}