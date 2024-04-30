import { Node, NodeParams, FallbackPortList, filterCallback, restoreCallback, FlowStoreContext, filterConnection, dumpArgumentsData, getId} from 'protoflow';
import { PackagePlus } from 'lucide-react';
import { useEffect, useState, useContext } from 'react';
import { API } from 'protolib/base'
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { useUpdateEffect } from 'usehooks-ts';

const objectCreate = (node: any = {}, nodeData = {}) => {
    const [objects, setObjects] = useState<any[]>([])
    const [keys, setKeys] = useState<any[]>([])
    const color = useColorFromPalette(1)
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)

    const getObjects = async () => {
        const { data } = await API.get('/adminapi/v1/objects?all=1')
        setObjects(data?.items);
    }

    useEffect(() => {
        getObjects()
    }, [])

    const onSelectObject = async () => {
        if (nodeData['param-1'] && nodeData['param-1'].value && objects.length) {
            const objectName = nodeData['param-1'].value
            const object = objects.find((item: any) => item.name == objectName)
            if (!object) return console.error('Object not found')

            const result = await API.get(`/adminapi/v1/objects/${object.id}`)

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
            return { ...obj, ['mask-' + key]: { value: '', kind: getKind(keys[key].type) } }
        }, {})
        
        const filteredNodeData = Object.keys(nodeData).reduce((obj, key) => {
            if (!key.startsWith('mask-') || initialData[key]) {
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
        setNodeData(node.id, {
            ...nodeData,
            'param-2': {
                ...nodeData['param-2'],
                _dump: (nodeData, level) => {
                    const params = Object.keys(nodeData).filter(key => key.startsWith('mask-')).map((param) => {
                        let key = param.split('-').slice(1).join('-');
                        var objValue = nodeData[param].value
                        return {key, value: objValue, kind: nodeData[param].kind}
                    })
                    return "{\n"
                        + params.reduce((total, p, i) => {
                            return p.value === "" ? total : total + "\t".repeat(level) + p.key + ': ' + dumpArgumentsData(p) + (i < params.length - 1 ? ',' : '')
                        }, '')
                        + "\n}"
                }
            }
        })
    }, [])

    useEffect(() => { onSelectObject() }, [nodeData['param-1'], objects])

    return (
        <Node icon={PackagePlus} node={node} isPreview={!node?.id} title='Object Create' id={node.id} color={color} skipCustom={true}>
            <NodeParams id={node.id} params={[{ label: 'Object', field: 'param-1', type: 'select', static: true, data: objects.map((item: any) => item.name) }]} />

            <FallbackPortList
                height='70px'
                node={node}
                fallbacks={[{
                    "name": "oncreate",
                    "label": "onCreate(item)",
                    "field": "param-5",
                    "preText": "async (item) => ",
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
                startPosX={60}
            />
            <NodeParams id={node.id} params={Object.keys(keys).map((key, i) => {
                return { label: key, field: 'mask-' + key, type: 'input', static: true }
            })} />
        </Node>
    )
}

export default {
    id: 'objectCreate',
    type: 'CallExpression',
    check: (node, nodeData) => {
        return (
            node.type == "CallExpression"
            && (nodeData.to == 'context.object.create')
        )
    },
    getComponent: objectCreate,
    category: "Objects (CMS)",
    keywords: ["create", "cms", "object"],
    filterChildren: (node, childScope, edges, nodeData, setNodeData) => {
        childScope = filterCallback("5", "oncreate")(node, childScope, edges)
        childScope = filterCallback("6", "onerror")(node, childScope, edges)
        childScope = filterConnection("param-2", (id, nodeData, setNodeData) => {
            const objData = nodeData[id]
            if(objData) {
                Object.keys(objData).forEach(key => {
                    if(key.startsWith('param-')) {
                        setNodeData(getId(node), {
                            ...nodeData[getId(node)],
                            ['mask-'+objData[key].key]: { value: objData[key].value, kind: objData[key].kind ?? 'Identifier'}
                        })
                    }

                })
            }
        })(node, childScope, edges, nodeData, setNodeData)
        return childScope
    },
    restoreChildren: (node, nodes, originalNodes, edges, originalEdges) => {
        let result = restoreCallback("5")(node, nodes, originalNodes, edges, originalEdges)
        result = restoreCallback("6")(node, result.nodes, originalNodes, result.edges, originalEdges)
        return result
    },
    getInitialData: () => {
        return {
            to: 'context.object.create',
            "param-1": { value: "", kind: "StringLiteral" },
            "param-2": { value: "{}", kind: "Identifier" },
            "param-3": { value: "context.objects", kind: "Identifier" },
            "param-4": { value: "null", kind: "Identifier" },
            "param-5": { value: "null", kind: "Identifier" },
            "param-6": { value: "null", kind: "Identifier" }
        }
    }
}