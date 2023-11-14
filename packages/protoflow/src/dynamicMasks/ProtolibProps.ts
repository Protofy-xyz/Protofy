import { FlowStoreContext } from "../store/FlowsStore"
import { useContext } from 'react';

export const getProtolibParams = (enabledProps = ["*"]) => {
    const allPropsEnabled = enabledProps[0] == "*"
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const colors = Object.keys(metadata?.tamagui?.color ?? {}).filter(item => item.startsWith("$")).map(k => '"' + metadata?.tamagui?.color[k].key + '"')
    const sizes = Object.keys(metadata?.tamagui?.size ?? {}).filter(item => item.startsWith("$")).map(k => '"' + metadata?.tamagui?.size[k].key + '"')
    const defaultValue = undefined
    return [
        { field: 'prop-bgColor', label: 'bgColor', type: 'select', fieldType: 'prop', data: colors ? [defaultValue, ...colors] : [], static: true },
        { field: 'prop-fontSize', label: 'fontSize', type: 'select', fieldType: 'prop', data: sizes ? [defaultValue, ...sizes] : [], static: true },
    ].filter(item =>  allPropsEnabled || enabledProps.includes(item.label))
}

export const getProtolibProps = () => {
    const params = getProtolibParams()
    return params.map(p => p.field)
}