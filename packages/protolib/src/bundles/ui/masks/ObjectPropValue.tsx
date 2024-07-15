import { useEffect, useState } from 'react';
import { Node, CustomFieldsList, getFieldValue } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Database } from '@tamagui/lucide-icons';
import { DimensionProps, LayoutProps, TextProps } from './PropsLists';
import { API } from 'protobase'

const ObjectPropValueMask = ({ node = {}, nodeData = {} }: any) => {
    const color = useColorFromPalette(55)
    const [objects, setObjects] = useState<any[]>([]);
    const [elementsIds, setElementsIds] = useState<any[]>([]);
    const [fields, setFields] = useState<any[]>([]);

    const objectsNames = objects.map((item: any) => item.name);

    let object = getFieldValue("prop-object", nodeData);;

    const getObjects = async () => {
        const { data } = await API.get('/adminapi/v1/objects?all=1')

        setObjects(data?.items);
    }

    const getElements = async () => {
        const { data } = await API.get('/api/v1/' + object + '?all=1')

        const items = data?.items ?? []
        setElementsIds(items.map((item: any) => item.id));
    }

    const getFields = async () => {
        const objectData = objects.find((item: any) => item.name == object)
        if (!objectData?.id) return
        const { data } = await API.get("/adminapi/v1/objects/" + objectData.id)
        const keys = data?.keys
        const stringFields = Object.keys(keys).filter((item: any) => ["string", "number", "date"].includes(keys[item].type))
        setFields(stringFields);
    }

    const propsList = [
        {
            "label": "object",
            "field": "prop-object",
            "staticLabel": true,
            "type": "select",
            "data": objectsNames,
            "section": "device"
        },
        {
            "label": "elementId",
            "field": "prop-elementId",
            "staticLabel": true,
            "type": "select",
            "data": elementsIds,
            "section": "device"
        },
        {
            "label": "field",
            "field": "prop-field",
            "staticLabel": true,
            "type": "select",
            "data": fields,
            "section": "device"
        },
        ...TextProps,
        ...LayoutProps,
        ...DimensionProps
    ]

    useEffect(() => {
        if (node.id) getObjects()
    }, [])

    useEffect(() => {
        if (object) {
            getElements()
            getFields()
        }
    }, [object, objects])

    return (
        <Node
            icon={Database}
            node={node}
            isPreview={!node.id}
            title='ObjectPropValue'
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
    id: 'ObjectPropValueMask',
    type: 'JsxElement',
    category: 'UI Elements',
    keywords: ['button', 'ui', 'simple'],
    check: (node, nodeData) => {
        return (
            ["JsxElement", "JsxSelfClosingElement"].includes(node.type) && nodeData.name == 'ObjectPropValue'
        )
    },
    getComponent: (node, nodeData, children) => <ObjectPropValueMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { name: 'ObjectPropValue' } }
}