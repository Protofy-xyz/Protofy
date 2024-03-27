import React, { useContext } from 'react';
import { FlowStoreContext } from "../store/FlowsStore"
import { NodeTypes } from '../nodes';
import convert from 'color-convert'
import { colord } from "colord";

type themeKey = "edgeColor" | "nodeBackgroundColor" | "inputBackgroundColor" | "textColor" | "interactiveColor" | 'interactiveHoverColor' | 'inputBorder' | 'borderColor'
    | 'borderWidth' | 'borderWidthSelected' | 'colorError' | 'handleBorderColor' | 'flowOutputColor' | 'dataOutputColor' | 'highlightInputBackgroundColor' | 'blockPort' | 'flowPort'
    | 'dataPort' | 'nodeBorderWidth' | 'nodeBorderColor' | 'portSize' | 'nodeFontSize' | 'containerColor' | 'titleColor' | 'disableTextColor' | 'nodeEdgeWidth' | 'nodeEdgeStyle'
    | 'plusColor' | 'selectedColor' | 'separatorColor' | 'nodePalette'

const commonVars: any = {
    nodeBorderWidth: '1px',
    nodeFontSize: 20,
    nodeEdgeWidth: 3,
    nodeEdgeStyle: "7 5"
}
commonVars.portSize = 20
commonVars.borderWidth = 0//Math.floor(commonVars.nodeFontSize / 10)
commonVars.borderWidthSelected = 0.5

const outlineColorLight = '#222'
const outlineColorDark = '#888'


const Theme = {
    light: {
        ...commonVars,
        nodePalette: {
            gamut: {
                hue: 20,
                saturation: 30,
                value: 90
            },
            custom: {
            
            }
        },
        plusColor: '#999',
        edgeColor: '#888',
        nodeBackgroundColor: "#fdfdfd",
        inputBackgroundColor: "white",
        inputBorder: '1px solid #ccc',
        textColor: "#666",
        selectedColor: "#2680EB",
        disableTextColor: "#ccc",
        interactiveColor: "#4fc2f7",
        interactiveHoverColor: 'rgba(79, 194, 247, 0.1)',
        borderColor: '#888',
        colorError: '#EF4444',
        handleBorderColor: 'white',
        flowOutputColor: 'white',
        dataOutputColor: 'black',
        highlightInputBackgroundColor: '#F1F1F1',
        blockPort: '#fefefe',
        flowPort: '#fefefe',
        dataPort: '#fefefe',
        nodeBorderColor: '#aaa',
        titleColor: '#333',
        containerColor: '#00000005',
        separatorColor: '#D4D4D4'
    },
    dark: {
        ...commonVars,
        nodePalette: {
            gamut: {
                hue: 20,
                saturation: 60,
                value: 90
            },
            custom: {
            
            }
        },
        plusColor: 'white',
        handleBorderColor: 'black',
        edgeColor: outlineColorDark,
        nodeBackgroundColor: "#303030", //bg of nodes
        inputBackgroundColor: "#404040",
        inputBorder: '0',
        textColor: "#e5e5e5",
        selectedColor: "#2680EB",
        disableTextColor: "grey",
        interactiveColor: "#4772b3",
        interactiveHoverColor: '#252525',
        borderColor: outlineColorDark,
        colorError: '#EF4444',
        flowOutputColor: 'grey',
        dataOutputColor: 'black',
        highlightInputBackgroundColor: "#222222",
        blockPort: 'black',
        flowPort: 'grey',
        dataPort: 'grey',
        nodeBorderColor: outlineColorDark,
        titleColor: 'black',
        containerColor: '#FFFFFF05',
        separatorColor: '#424242'
    }
}

const useTheme = (key: themeKey, defaultValue = null) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const themeMode = useFlowsStore(state => state.themeMode)
    const themeOverride = useFlowsStore(state => state.themeOverride)
    const _theme = { ...Theme[themeMode], ...themeOverride }
    try {
        const value = _theme[key]
        return value
    } catch (e) {
        return defaultValue
    }

}
const keys = Object.keys(NodeTypes)
const totalKeys = keys.length
const generateColor = (type:string, gamut:{hue: number, saturation: number, value: number}) => {
    const i = keys.indexOf(type)
    const h = (100 * (totalKeys / (i+1))) + gamut.hue % 100
    return "#"+convert.hsv.hex(h, gamut.saturation, gamut.value)
}

export const generateColorbyIndex = (index, arrLength) => {
    const nodePalette = useTheme('nodePalette', {})
    const gamut = nodePalette.gamut
    var i = index < 0 ? 0 : index

    const h = (100 * (arrLength / (i + 1))) + gamut.hue % 100
    return "#" + convert.hsv.hex(h, gamut.saturation, gamut.value)
}

export const useNodeColor = (type) => {
    //NodeTypes
    const nodePalette = useTheme('nodePalette', {})
    return nodePalette.custom[type] ?? generateColor(type, nodePalette.gamut) //nodePalette.colors[Object.keys(NodeTypes).indexOf(type) % nodePalette.colors.length]
}

export const usePrimaryColor = () => {
    const nodePalette = useTheme('nodePalette', {})
    const useFlowsStore = useContext(FlowStoreContext)
    const primaryColor = useFlowsStore(state => state.primaryColor)
    const themeMode = useFlowsStore(state => state.themeMode)
    if(themeMode == 'dark') {
        return '#'+convert.hsv.hex(colord(primaryColor).hue(),nodePalette.gamut.saturation-10,nodePalette.gamut.value+5)
    } else {
        return '#'+convert.hsv.hex(colord(primaryColor).hue(),nodePalette.gamut.saturation,nodePalette.gamut.value)
    }

}

export default useTheme