import { FlowStoreContext } from "../store/FlowsStore"
import { useContext } from 'react';

export const getProtolibParams = () => {
    const useFlowsStore = useContext(FlowStoreContext)
    const metadata = useFlowsStore(state => state.metadata)
    const colors = Object.keys(metadata?.tamagui?.color ?? {}).filter(item => item.startsWith("$")).map(k => '"' + metadata?.tamagui?.color[k].key + '"')
    const defaultBgColor = undefined
    return [
        { field: 'prop-bgColor', label: 'bgColor', type: 'select', fieldType: 'prop', data: colors ? [defaultBgColor, ...colors] : [], static: true }
    ]
}

export const getProtolibProps = () => {
    const params = getProtolibParams()
    return params.map(p => p.field)
}