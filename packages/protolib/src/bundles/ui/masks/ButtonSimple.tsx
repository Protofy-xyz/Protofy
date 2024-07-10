import { Node, NodeParams, FallbackPortList, filterCallbackProp, restoreCallbackProp, CustomFieldsList } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Timer } from 'lucide-react';
import { useRef } from 'react'
import { DecorationProps, DimensionProps, LayoutProps, ThemeProps } from './PropsLists';

const ButtonSimpleMask = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef<HTMLDivElement>()
    const color = useColorFromPalette(55)

    const childs = [
        {
            "label": "caption",
            "field": "child-1",
            "type": "child"
        }
    ]

    const propsList = [
        ...ThemeProps,
        ...DimensionProps,
        ...LayoutProps,
        ...DecorationProps,
        {
            "label": "textColor",
            "field": "prop-textColor",
            "staticLabel": true,
            "type": "color",
            "section": "theme"
        },
        {
            "label": "fontFamily",
            "field": "prop-fontFamily",
            "staticLabel": true,
            "type": "select",
            "data": [
                "$body",
                "$cherryBomb",
                "$heading",
                "$headingDmSans",
                "$headingDmSerifDisplay",
                "$mono",
                "$munro",
                "$silkscreen"
            ],
            "section": "theme"
        },
        {
            "label": "size",
            "field": "prop-size",
            "staticLabel": true,
            "type": "range-theme",
            "section": "dimensions"
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