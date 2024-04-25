import { Node, NodeParams, FallbackPortList, filterCallbackProp, restoreCallbackProp, CustomFieldsList } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Timer } from 'lucide-react';
import { useRef } from 'react'

const InputMask = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(55)

    const propsList = [
        {
            "label": "state (cs)",
            "field": "prop-state",
            "staticLabel": true,
            "type": "input",
            "section": "logic",
            "pre": str => str.replace('cs.', ''),
            "post": str => 'cs.' + str,
            "disableToggle": true
        },
        {
            "label": "theme",
            "field": "prop-theme",
            "staticLabel": true,
            "type": "color-theme",
            "section": "layout"
        },
        {
            "label": "textColor",
            "field": "prop-textColor",
            "staticLabel": true,
            "type": "color",
            "section": "layout"
        },
        {
            "label": "margin",
            "field": "prop-margin",
            "staticLabel": true,
            "type": "range-theme",
            "section": "layout"
        },
        {
            "label": "padding",
            "field": "prop-padding",
            "staticLabel": true,
            "type": "range-theme",
            "section": "layout"
        },
        {
            "label": "size",
            "field": "prop-size",
            "staticLabel": true,
            "type": "range-theme",
            "section": "dimensions"
        },
        {
            "label": "chromeless",
            "field": "prop-chromeless",
            "staticLabel": true,
            "type": "toggle-boolean",
            "section": "decoration"
        },
        {
            "label": "alignSelf",
            "field": "prop-alignSelf",
            "staticLabel": true,
            "type": "alignment-items",
            "section": "layout"
        },
        {
            "label": "width",
            "field": "prop-width",
            "staticLabel": true,
            "type": "input",
            "section": "dimensions"
        },
        {
            "label": "borderRadius",
            "field": "prop-borderRadius",
            "staticLabel": true,
            "type": "range-theme",
            "section": "decoration"
        }
    ]

    return (
        <Node
            icon={Timer}
            node={node}
            isPreview={!node.id}
            title='Input' color={color} id={node.id}
            skipCustom={true}
            disableInput
            disableOutput
        >
            <CustomFieldsList node={node} nodeData={nodeData} fields={propsList} />
        </Node >
    )
}

export default {
    id: 'InputMask',
    type: 'JsxElement',
    category: 'UI Events',
    keywords: ['input', 'ui'],
    check: (node, nodeData) => {
        return (
            node.type == "JsxElement" && nodeData.name == 'Input'
        )
    },
    getComponent: (node, nodeData, children) => <InputMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { name: 'Input' } }
}