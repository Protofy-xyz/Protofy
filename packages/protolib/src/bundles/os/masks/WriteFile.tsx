import { Node, NodeParams, CustomFieldsList, FallbackPortList, filterCallback, FlowPort, FallbackPort, restoreCallback} from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Cable } from '@tamagui/lucide-icons';
import { useRef } from 'react';

const WriteFile = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef<any>()
    const color = useColorFromPalette(11)

    const params = [
        {
            "label": "path",
            "field": "param-1",
            "type": "input"
        },
        {
            "label": "content",
            "field": "param-2",
            "type": "input"
        }
    ]
    const fallbacks = [
        {
            "name": "error",
            "label": "onError (err)",
            "field": "param-3",
            "preText": "async (err) => ",
            "postText": "",
            "fallbackText": "null",
            "type": "output"
        }
    ]

    return (
        <Node icon={Cable} node={node} isPreview={!node.id} title='Write file' color={color} id={node.id} skipCustom={true}>
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
    id: 'WriteFile',
    type: 'CallExpression',
    category: 'OS',
    hidden: true,
    keywords: ['fs', 'os', 'write', 'file'],
    check: (node, nodeData) => {
        return node.type == "CallExpression" && nodeData.to?.startsWith('context.os.fileWriter')
    },
    getComponent: (node, nodeData, children) => <WriteFile node={node} nodeData={nodeData} children={children} />,
    filterChildren: (node, childScope, edges)=> {
        childScope = filterCallback("3", "error")(node,childScope,edges)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("3")(node, nodes, originalNodes, edges, originalEdges)
        return result
    },
    getInitialData: () => {
        return {
            to: 'context.os.fileWriter',
            "param-1": {
                value: "",
                kind: "StringLiteral"
            },
            "param-2": {
                value: "",
                kind: "StringLiteral"
            },
            "param-3": {
                value: "null",
                kind: "Identifier"
            },
        }
    }
}