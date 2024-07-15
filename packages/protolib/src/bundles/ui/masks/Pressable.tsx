import { Node, NodeParams, FallbackPortList, filterCallbackProp, restoreCallbackProp, CustomFieldsList, AddPropButton, Field } from 'protoflow';
import { useColorFromPalette } from 'protoflow/src/diagram/Theme'
import { Timer } from 'lucide-react';
import { useRef } from 'react'
import { DecorationProps, DimensionProps, LayoutProps, ThemeProps } from './PropsLists';

const PressableMask = ({ node = {}, nodeData = {}, children }: any) => {
    const paramsRef = useRef()
    const color = useColorFromPalette(55)

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
            "section": "layout"
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

    const childs: Field[] = Object.keys(nodeData).filter((p) => p.startsWith('child-')).map((prop: any, i) => {
        return { label: ('Child' + (i + 1)), field: prop, fieldType: 'child', deleteable: true } as Field
    })

    return (
        <Node
            icon={Timer}
            node={node}
            isPreview={!node.id}
            title='Pressable' color={color} id={node.id}
            skipCustom={true}
            disableInput
            disableOutput
        >
            <div ref={paramsRef}>
                <CustomFieldsList node={node} nodeData={nodeData} fields={propsList} />
            </div>
            <div>
                {
                    (paramsRef.current as HTMLDivElement)?.clientHeight ? <FallbackPortList node={node} fallbacks={fallbacks} startPosX={(paramsRef.current as HTMLDivElement)?.clientHeight} /> : null
                }
            </div>
            <NodeParams id={node.id} params={childs} />
            <AddPropButton id={node.id} type="Child" nodeData={nodeData} />
        </Node >
    )
}

export default {
    id: 'PressableMask',
    type: 'JsxElement',
    category: 'UI Elements',
    keywords: ['button', 'ui', 'simple'],
    check: (node, nodeData) => {
        return (
            node.type == "JsxElement" && nodeData.name == 'Pressable'
        )
    },
    getComponent: (node, nodeData, children) => <PressableMask node={node} nodeData={nodeData} children={children} />,
    getInitialData: () => { return { name: 'Pressable' } },
    filterChildren: filterCallbackProp("onPress"),
    restoreChildren: restoreCallbackProp("onPress")
}