import React, {useContext} from 'react';
import { FlowStoreContext } from "../store/FlowsStore"

type themeKey = "edgeColor" | "nodeBackgroundColor" | "inputBackgroundColor" | "textColor" | "interactiveColor" | 'interactiveHoverColor' | 'inputBorder' | 'borderColor' 
| 'borderWidth' | 'borderWidthSelected' | 'colorError' | 'handleBorderColor' | 'flowOutputColor' | 'dataOutputColor' | 'highlightInputBackgroundColor' | 'blockPort' | 'flowPort'
| 'dataPort' | 'nodeBorderWidth' | 'nodeBorderColor' | 'portSize' | 'nodeFontSize' | 'containerColor' | 'titleColor'

const commonVars:any = {
    nodeBorderWidth: '2px',
    nodeFontSize: 30
}
commonVars.portSize = commonVars.nodeFontSize
commonVars.borderWidth = commonVars.nodeFontSize / 8
commonVars.borderWidthSelected = commonVars.nodeFontSize / 5
const Theme = {
    light: {
        ...commonVars,
        edgeColor: "#777",
        nodeBackgroundColor: "white",
        inputBackgroundColor: "white",
        inputBorder: '1px solid #ccc',
        textColor: "black",
        interactiveColor: "#4fc2f7",
        interactiveHoverColor: 'rgba(79, 194, 247, 0.1)',
        borderColor: 'black',
        colorError: '#EF4444',
        handleBorderColor: 'white',
        flowOutputColor: 'white',
        dataOutputColor: 'black',
        highlightInputBackgroundColor: '#F1F1F1',
        blockPort: 'white',
        flowPort: 'white',
        dataPort: 'white',
        nodeBorderColor: 'black',
        titleColor: 'black',
        containerColor: 'black'
    },
    dark: {
        ...commonVars,
        handleBorderColor: 'black',
        edgeColor: "#e5e5e5",
        nodeBackgroundColor: "#303030",
        inputBackgroundColor: "#404040",
        inputBorder: '0',
        textColor: "#e5e5e5",
        interactiveColor: "#4772b3",
        interactiveHoverColor: '#252525',
        borderColor: 'grey',
        colorError: '#EF4444',
        flowOutputColor: 'grey',
        dataOutputColor: 'black',
        highlightInputBackgroundColor: "#222222",
        blockPort: 'black',
        flowPort: 'grey',
        dataPort: 'grey',
        nodeBorderColor: '#e5e5e5',
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