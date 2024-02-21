import { FlowStoreContext } from "../store/FlowsStore"
import { useContext } from 'react';
import { getAlignmentTypes } from "./AlignmentType";
import { getColorTypes } from "./ColorType";

export const getCustomParams = (enabledProps = ["*"]) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)

    const allPropsEnabled = enabledProps[0] == "*"

    const sizes = Object.keys(metadata?.tamagui?.size ?? {}).filter(item => item.startsWith("$")).map(k => '"' + metadata?.tamagui?.size[k].key + '"')
    const radiuses = Object.keys(metadata?.tamagui?.radius ?? {}).filter(item => item.startsWith("$")).map(k => '"' + metadata?.tamagui?.radius[k].key + '"')
    const spaces = Object.keys(metadata?.tamagui?.space ?? {}).filter(item => item.startsWith("$")).map(k => '"' + metadata?.tamagui?.space[k].key + '"')
    const zIndexes = Object.keys(metadata?.tamagui?.zIndex ?? {}).filter(item => item.startsWith("$")).map(k => '"' + metadata?.tamagui?.zIndex[k].key + '"')
    const defaultValue = undefined

    return [
        { field: 'prop-fontSize', label: 'fontSize', type: 'select', fieldType: 'prop', data: sizes ? [defaultValue, ...sizes] : [], static: true },
        { field: 'prop-br', label: 'br', type: 'select', fieldType: 'prop', data: radiuses ? [defaultValue, ...radiuses] : [], static: true },
        { field: 'prop-bw', label: 'bw', type: 'select', fieldType: 'prop', data: sizes ? [defaultValue, ...sizes] : [], static: true },
        { field: 'prop-size', label: 'size', type: 'select', fieldType: 'prop', data: sizes ? [defaultValue, ...sizes] : [], static: true },
        {
            field: 'prop-margin', label: 'margin', type: 'range', fieldType: 'prop', data: {
                step: 1,
                min: 0,
                max: 20,
                kind: "StringLiteral"
            }, pre: (s) => s[0] == "$" ? s.split("$")[1] : s, post: (s) => "$" + s, static: true
        },
        {
            field: 'prop-padding', label: 'padding', type: 'range', fieldType: 'prop', data: {
                step: 1,
                min: 0,
                max: 20,
                kind: "StringLiteral"
            }, pre: (s) => s[0] == "$" ? s.split("$")[1] : s, post: (s) => "$" + s, static: true
        },
        { field: 'prop-space', label: 'space', type: 'select', fieldType: 'prop', data: spaces ? [defaultValue, ...spaces] : [], static: true },
        { field: 'prop-opacity', label: 'opacity', type: 'range', fieldType: 'prop', data: { min: 0, max: 1, step: 0.1, defaultValue: 1 }, static: true },
        { field: 'prop-width', label: 'width', type: 'input', fieldType: 'prop', static: true },
        { field: 'prop-height', label: 'height', type: 'input', fieldType: 'prop', static: true },
        { field: 'prop-zi', label: 'zi', type: 'select', fieldType: 'prop', data: zIndexes ? [defaultValue, ...zIndexes] : [], static: true },
    ].filter(item => allPropsEnabled || enabledProps.includes(item.field))
}
export const getPropsFieldNamesArr = (itemArr) => itemArr.map(i => i.field)

export const getCustomProps = (data) => {
    const rawData = data.find(i => i.type == 'custom-prop')?.data ?? []
    const maskProps = getPropsFieldNamesArr(rawData)

    const params = getCustomParams()
    return [...params.map(p => p.field), ...maskProps]
}

export const getAllTypes = () => {
    const alignmentTypes = getAlignmentTypes()
    const colorTypes = getColorTypes()

    return [...alignmentTypes, ...colorTypes]
}