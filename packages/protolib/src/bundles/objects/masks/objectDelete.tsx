import { Node, NodeParams, FallbackPortList, filterCallback, restoreCallback } from 'protoflow';
import { Trash2 } from '@tamagui/lucide-icons';
import { useEffect, useState } from 'react';
import { API } from 'protobase'
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'

const objectDelete = (node: any = {}, nodeData = {}) => {
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
        <Node icon={Trash2} node={node} isPreview={!node?.id} title='Object Delete' id={node.id} color={color} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Object', field: 'param-1', type: 'select', static: true, data: objects }]} />
            <NodeParams id={node.id} params={[{ label: 'Object ID', field: 'param-2', type: 'input' }]} />
            <FallbackPortList 
                height='70px'
                node={node} 
                fallbacks={[{
                    "name": "ondelete",
                    "label": "onDelete",
                    "field": "param-5",
                    "preText": "async () => ",
                    "postText": "",
                    "fallbackText": "null"
                }, {
                    "name": "onerror",
                    "label": "OnError (error)",
                    "field": "param-6",
                    "preText": "async (error) => ",
                    "fallbackText": "null",
                    "postText": ""
                }]} 
                startPosX={125}
            />
        </Node>
    )
}

export default {
    id: 'objectDelete',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && (nodeData.to == 'context.object.deleteObject')
        )
    },
    getComponent: objectDelete,
    category: "Objects (CMS)",
    keywords: ["delete", "cms", "object"],
    filterChildren: (node, childScope, edges) => {
        childScope = filterCallback("5", "ondelete")(node, childScope, edges)
        childScope = filterCallback("6", "onerror")(node, childScope, edges)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("5")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("6")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getInitialData: () => {
        return {
            to: 'context.object.deleteObject',
            "param-1": { value: "", kind: "StringLiteral" },
            "param-2": { value: "", kind: "StringLiteral" },
            "param-3": { value: "context.objects", kind: "Identifier" },
            "param-4": { value: "null", kind: "Identifier" },
            "param-5": { value: "null", kind: "Identifier" },
            "param-6": { value: "null", kind: "Identifier" }
        }
    }
}