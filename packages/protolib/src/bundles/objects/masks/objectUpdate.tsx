import { Node, NodeParams, FallbackPortList, filterCallback, restoreCallback, FlowStoreContext, filterConnection, dumpArgumentsData, getId, getFieldValue, getDataFromField } from 'protoflow';
import { PenLine } from '@tamagui/lucide-icons';
import { useEffect, useState, useContext } from 'react';
import { API } from 'protobase'
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { useUpdateEffect } from 'usehooks-ts';

const objectUpdate = (node: any = {}, nodeData = {}) => {
    const [objects, setObjects] = useState<any[]>([])
    const [keys, setKeys] = useState<any[]>([])
    const color = useColorFromPalette(1)
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)

    const getObjects = async () => {
        const { data } = await API.get('/api/core/v1/objects?all=1')
        setObjects(data?.items);
    }

    useEffect(() => {
        if (node.id) getObjects()
    }, [])

    const onSelectObject = async () => {
        if (nodeData['param-1'] && nodeData['param-1'].value && objects.length) {
            const objectName = nodeData['param-1'].value
            const object = objects.find((item: any) => item.name == objectName)
            if (!object) return console.error('Object not found')

            const result = await API.get(`/api/core/v1/objects/${object.id}`)

            if (result.isLoaded) {
                const objectKeys = result?.data?.keys
                setKeys(objectKeys)
            }
        }
    }

    const getKind = (type: string) => {
        if (type == 'string') return 'StringLiteral'
        if (type == 'number') return 'NumericLiteral'
        return 'Identifier'
    }

    useUpdateEffect(() => {
        const initialData = Object.keys(keys).reduce((obj, key) => {
            return { ...obj, ['mask-3-' + key]: { value: '', kind: getKind(keys[key].type) } }
        }, {})

        const filteredNodeData = Object.keys(nodeData).reduce((obj, key) => {
            if (!key.startsWith('mask-3-') || initialData[key]) {
                obj[key] = nodeData[key];
            }
            return obj;
        }, {});

        setNodeData(node.id, {
            ...initialData,
            ...filteredNodeData
        });
    }, [keys])

    useEffect(() => {
        if (!node.id) return

        const dumpMaskParams = (filterCb) => (nodeData, level) => {
            const params = Object.keys(nodeData).filter(filterCb).map((param) => {
                let key = param.split('-').slice(2).join('-');
                var objValue = nodeData[param].value
                return { key, value: objValue, kind: nodeData[param].kind }
            })
            return "{\n"
                + params.reduce((total, p, i) => {
                    return p.value === "" ? total : total + "\t".repeat(level) + p.key + ': ' + dumpArgumentsData(p) + (i < params.length - 1 ? ',' : '')
                }, '')
                + "\n}"
        }

        setNodeData(node.id, {
            ...nodeData,
            'param-3': {
                ...nodeData['param-3'],
                _dump: dumpMaskParams(key => key.startsWith('mask-3-'))
            },
            'param-5': {
                ...nodeData['param-5'],
                _dump: dumpMaskParams(key => key.startsWith('mask-5-'))
            }
        })
    }, [])

    useEffect(() => { onSelectObject() }, [nodeData['param-1'], objects])

    return (
        <Node icon={PenLine} node={node} isPreview={!node?.id} title='Object Update' id={node.id} color={color} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Object', field: 'param-1', type: 'select', static: true, data: objects.map((item: any) => item.name) }]} />
            <NodeParams id={node.id} params={[{ label: 'Object Id', field: 'param-2', type: 'input' }]} />
            <FallbackPortList
                height='70px'
                node={node}
                fallbacks={[{
                    "name": "onupdate",
                    "label": "onUpdate(item)",
                    "field": "param-6",
                    "preText": "async (item) => ",
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
                startPosX={110}
            />
            <NodeParams id={node.id} params={[{ label: "update only changed fields", field: 'mask-5-patch', type: 'boolean', static: true }]} />
            <NodeParams id={node.id} params={Object.keys(keys).map((key, i) => {
                return { label: key, field: 'mask-3-' + key, type: 'input', static: true }
            })} />
        </Node>
    )
}

export default {
    id: 'objectUpdate',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && (nodeData.to == 'context.object.update')
        )
    },
    getComponent: objectUpdate,
    category: "Objects (CMS)",
    keywords: ["update", "cms", "object"],
    filterChildren: (node, childScope, edges, nodeData, setNodeData) => {
        childScope = filterCallback("6", "onupdate")(node, childScope, edges)
        childScope = filterCallback("7", "onerror")(node, childScope, edges)

        const filterMaskConnection = (connection) => filterConnection("param-" + connection, (id, nodeData, setNodeData) => {
            const objData = nodeData[id]
            if (objData) {
                Object.keys(objData).forEach(key => {
                    if (key.startsWith('param-')) {
                        setNodeData(getId(node), {
                            ...nodeData[getId(node)],
                            ["mask-" + connection + "-" + objData[key].key]: { value: objData[key].value, kind: objData[key].kind ?? 'Identifier' }
                        })
                    }

                })
            }
        })(node, childScope, edges, nodeData, setNodeData)

        childScope = filterMaskConnection("3")
        childScope = filterMaskConnection("5")

        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("6")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("7")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getInitialData: () => {
        return {
            to: 'context.object.update',
            "param-1": { value: "", kind: "StringLiteral" },
            "param-2": { value: "", kind: "StringLiteral" },
            "param-3": { value: "{}", kind: "Identifier" },
            "param-4": { value: "context.objects", kind: "Identifier" },
            "param-5": { value: "{}", kind: "Identifier" },
            "mask-5-patch": { value: "true", kind: "FalseKeyword" },
            "param-6": { value: "null", kind: "Identifier" },
            "param-7": { value: "null", kind: "Identifier" }
        }
    }
}