import { Node, NodeParams, FallbackPortList, filterCallbackProp, restoreCallbackProp, CustomFieldsList } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Timer } from 'lucide-react';
import { useRef } from 'react'

const ButtonSimpleMask = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(55)

    const childs = [
        {
            "label": "caption",
            "field": "child-1",
            "type": "child"
        }
    ]

    const propsList = [
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
            "label": "circular",
            "field": "prop-circular",
            "staticLabel": true,
            "type": "toggle-boolean",
            "section": "decoration"
        },
        {
            "label": "chromeless",
            "field": "prop-chromeless",
            "staticLabel": true,
            "type": "toggle-boolean",
            "section": "decoration"
        },
        {
            "label": "themeInverse",
            "field": "prop-themeInverse",
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
            "label": "height",
            "field": "prop-height",
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

    const fallbacks = [
        {
            "label": "OnPress (e)",
            "field": "prop-onPress",
            "preText": "{(e) => ",
            "postText": "}"
        }
    ]

    return (
        <Node
            icon={Timer}
            node={node}
            isPreview={!node.id}
            title='ButtonSimple' color={color} id={node.id}
            skipCustom={true}
            disableInput
            disableOutput
        >
            <div ref={paramsRef}>
                <NodeParams id={node.id} params={childs} />
                <CustomFieldsList node={node} nodeData={nodeData} fields={propsList} />
            </div>
            <div>
                {
                    paramsRef?.current?.clientHeight ? <FallbackPortList node={node} fallbacks={fallbacks} startPosX={paramsRef?.current?.clientHeight} /> : null
                }
            </div>
        </Node >
    )
}

export default {
    id: 'ButtonSimpleMask',
    type: 'JsxElement',
    category: 'UI Elements',
    keywords: ['button', 'ui', 'simple'],
    check: (node, nodeData) => {
        return (
            node.type == "JsxElement" && nodeData.name == 'ButtonSimple'
        )
    },
    getComponent: (node, nodeData, children) => <ButtonSimpleMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { name: 'ButtonSimple' } },
    filterChildren: filterCallbackProp("onPress"),
    restoreChildren: restoreCallbackProp("onPress")
}