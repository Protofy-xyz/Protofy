import React from "react";
import useTheme from "../diagram/Theme";
import Text from '../diagram/NodeText'
import AlignmentType, { getAlignmentTypes } from "./AlignmentFields";
import ColorType, { getColorTypes } from "./ColorFields";
import RangeType, { getRangeTypes } from "./RangeFields";
import BooleanFields, { getToggleTypes } from "./ToggleFields";

export const getCustomFields = (data) => {
    const rawData = data.find(i => i.type == 'custom-field')?.data ?? []
    const maskCustomFields = rawData.map(i => i.field)

    return [...maskCustomFields]
}

export const getAllFieldTypes = () => {
    const alignmentTypes = getAlignmentTypes()
    const colorTypes = getColorTypes()
    const rangeTypes = getRangeTypes()
    const toggleTypes = getToggleTypes()

    return [...alignmentTypes, ...colorTypes, ...rangeTypes, ...toggleTypes]
}

export const CustomFieldType = ({ item, node, nodeData }) => {
    var type = item.type ?? ''
    var category = type.split('-')[0]

    switch (category) {
        case 'alignment':
            return <AlignmentType node={node} item={item} nodeData={nodeData} />

        case 'color':
            return <ColorType node={node} item={item} nodeData={nodeData} />

        case 'range':
            return <RangeType node={node} item={item} nodeData={nodeData} />

        case 'boolean':
            return <BooleanFields node={node} item={item} nodeData={nodeData} />

        default:
            return <></>
    }
}

export const CustomField = ({ label, input }: any) => {
    const nodeFontSize = useTheme('nodeFontSize')

    return <div style={{ alignItems: 'stretch', flexBasis: 'auto', flexShrink: 0, listStyle: 'none', position: 'relative', display: 'flex', flexDirection: "column" }}>
        <div style={{ fontSize: nodeFontSize + 'px', padding: '8px 15px 8px 15px', display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
            <div className={"handleKey"} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text>{label}</Text>
            </div>
            <div className={"handleValue"} style={{ minWidth: '180px', marginRight: '10px', display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'center' }}>
                {input}
            </div>
        </div>
    </div>
}