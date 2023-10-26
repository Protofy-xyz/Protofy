import React, {useContext} from 'react';
import { FlowStoreContext } from "../store/FlowsStore"

type themeKey = "edgeColor" | "nodeBackgroundColor" | "inputBackgroundColor" | "textColor" | "interactiveColor" | 'interactiveHoverColor' | 'inputBorder' | 'borderColor' 
| 'borderWidth' | 'borderWidthSelected' | 'colorError' | 'handleBorderColor' | 'flowOutputColor' | 'dataOutputColor' | 'highlightInputBackgroundColor' | 'blockPort' | 'flowPort'
| 'dataPort' | 'nodeBorderWidth' | 'nodeBorderColor' | 'portSize' | 'nodeFontSize' | 'containerColor' | 'titleColor' | 'disableTextColor' | 'nodeEdgeWidth' | 'nodeEdgeStyle'

const commonVars:any = {
    nodeBorderWidth: '3px',
    nodeFontSize: 30,
    nodeEdgeWidth: 4,
    nodeEdgeStyle: "7 5"
}
commonVars.portSize = Math.floor(commonVars.nodeFontSize / 1.1)
commonVars.borderWidth = Math.floor(commonVars.nodeFontSize / 10)
commonVars.borderWidthSelected = Math.floor(commonVars.nodeFontSize / 7)

const outlineColorLight = '#222'
const outlineColorDark = '#888'
const Theme = {
    light: {
        ...commonVars,
        edgeColor: outlineColorLight,
        nodeBackgroundColor: "white",
        inputBackgroundColor: "white",
        inputBorder: '1px solid #ccc',
        textColor: "black",
        disableTextColor: "#ccc",
        interactiveColor: "#4fc2f7",
        interactiveHoverColor: 'rgba(79, 194, 247, 0.1)',
        borderColor: outlineColorLight,
        colorError: '#EF4444',
        handleBorderColor: 'white',
        flowOutputColor: 'white',
        dataOutputColor: 'black',
        highlightInputBackgroundColor: '#F1F1F1',
        blockPort: 'white',
        flowPort: 'white',
        dataPort: 'white',
        nodeBorderColor: outlineColorLight,
        titleColor: 'black',
        containerColor: 'black'
    },
    dark: {
        ...commonVars,
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
        containerColor: 'white'
    }
}

const useTheme = (key:themeKey, defaultValue=null) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const themeMode = useFlowsStore(state => state.themeMode)
    const themeOverride = useFlowsStore(state => state.themeOverride)
    const _theme = {...Theme[themeMode], ...themeOverride}
    try {
        const value = _theme[key]
        return value
    } catch (e) {
        return defaultValue
    }

}

export default useTheme