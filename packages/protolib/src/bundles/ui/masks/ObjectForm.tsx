import { useEffect, useState } from 'react';
import { Node, CustomFieldsList, getFieldValue } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Database } from 'lucide-react';
import { API } from 'protolib/base'

const ObjectFormMask = ({ node = {}, nodeData = {} }: any) => {
    const color = useColorFromPalette(55)
    const [objects, setObjects] = useState<any[]>([]);
    const [elementsIds, setElementsIds] = useState<any[]>([]);

    const objectsNames = objects.map((item: any) => item.name);
    const objectPre = str => str.replace('Objects.', '')

    let object = getFieldValue("prop-model", nodeData);

    const getObjects = async () => {
        const { data } = await API.get('/adminapi/v1/objects?all=1')

        setObjects(data?.items);
    }

    const getElements = async () => {
        const { data } = await API.get('/api/v1/' + objectPre(object) + '?all=1')

        const items = data?.items ?? []
        setElementsIds(items.map((item: any) => item.id));
    }

    const propsList = [
        {
            "label": "model",
            "field": "prop-model",
            "staticLabel": true,
            "type": "select",
            "data": objectsNames,
            "pre": objectPre,
            "post": str => 'Objects.' + str,
            "section": "basic"
        },
        {
            "label": "elementId",
            "field": "prop-elementId",
            "staticLabel": true,
            "type": "select",
            "data": elementsIds,
            "section": "basic"
        },
    ]

    useEffect(() => {
        if (node.id) getObjects()
    }, [])

    useEffect(() => {
        if (object) {
            getElements()
        }
    }, [object, objects])

    return (
        <Node
            icon={Database}
            node={node}
            isPreview={!node.id}
            title='ObjectForm'
            color={color}
            id={node.id}
            skipCustom={true}
            disableInput
            disableOutput
        >
            <CustomFieldsList node={node} nodeData={nodeData} fields={propsList} />
        </Node >
    )
}

export default {
    id: 'ObjectFormMask',
    type: 'JsxElement',
    category: 'UI Elements',
    keywords: ['form', 'object', 'ui'],
    check: (node, nodeData) => {
        return (
            ["JsxElement", "JsxSelfClosingElement"].includes(node.type) && nodeData.name == 'ObjectForm'
        )
    },
    getComponent: (node, nodeData, children) => <ObjectFormMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { name: 'ObjectForm' } }
}