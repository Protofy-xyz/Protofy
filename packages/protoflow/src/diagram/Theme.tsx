import React, { useContext } from 'react';
import { FlowStoreContext } from "../store/FlowsStore"

type themeKey = "edgeColor" | "nodeBackgroundColor" | "inputBackgroundColor" | "textColor" | "interactiveColor" | 'interactiveHoverColor' | 'inputBorder' | 'borderColor'
    | 'borderWidth' | 'borderWidthSelected' | 'colorError' | 'handleBorderColor' | 'flowOutputColor' | 'dataOutputColor' | 'highlightInputBackgroundColor' | 'blockPort' | 'flowPort'
    | 'dataPort' | 'nodeBorderWidth' | 'nodeBorderColor' | 'portSize' | 'nodeFontSize' | 'containerColor' | 'titleColor' | 'disableTextColor' | 'nodeEdgeWidth' | 'nodeEdgeStyle'
    | 'plusColor'

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
        plusColor: '#999',
        edgeColor: '#888',
        nodeBackgroundColor: "#fdfdfd",
        inputBackgroundColor: "white",
        inputBorder: '1px solid #ccc',
        textColor: "#666",
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
        titleColor: '#222',
        containerColor: '#00000005'
    },
    dark: {
        ...commonVars,
        plusColor: 'white',
        handleBorderColor: 'black',
        edgeColor: outlineColorDark,
        nodeBackgroundColor: "#303030", //bg of nodes
        inputBackgroundColor: "#404040",
        inputBorder: '0',
        textColor: "#e5e5e5",
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
        containerColor: '#FFFFFF05'
    },
    preview: {
        ...commonVars,
        plusColor: 'white',
        handleBorderColor: 'black',
        edgeColor: outlineColorDark,
        nodeBackgroundColor: "#303030", //bg of nodes
        inputBackgroundColor: "#404040",
        inputBorder: '0',
        textColor: "#e5e5e5",
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
        containerColor: '#FFFFFF05'
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

export default useTheme