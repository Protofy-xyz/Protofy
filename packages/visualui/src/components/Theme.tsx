import { useThemeSetting } from '@tamagui/next-theme'

type themeKey = "edgeColor" | "nodeBackgroundColor" | "inputBackgroundColor" | "textColor" | "interactiveColor" | 'interactiveHoverColor' | 'interactiveHoverColorDarken' | 'inputBorder' | 'borderColor'
    | 'borderWidth' | 'borderWidthSelected' | 'colorError' | 'handleBorderColor' | 'flowOutputColor' | 'dataOutputColor' | 'highlightInputBackgroundColor' | 'blockPort' | 'flowPort'
    | 'dataPort' | 'nodeBorderWidth' | 'nodeBorderColor' | 'portSize' | 'nodeFontSize' | 'containerColor' | 'titleColor' | 'disableTextColor' | 'nodeEdgeWidth' | 'nodeEdgeStyle'
    | 'plusColor' | 'selectedColor' | 'secondaryBackground' | 'separatorColor'

const theme = {
    dark: {
        nodeBackgroundColor: '#252526',
        interactiveHoverColor: '#2C446A',
        interactiveHoverColorDarken: '#2C446A',
        interactiveColor: "#4772b3",
        inputBackgroundColor: "#404040",
        secondaryBackground: '#191919',
        borderColor: 'grey',
        blockPort: 'grey',
        flowPort: 'grey',
        dataPort: 'grey',
        textColor: '#CCCCCC',
        dataOutputColor: 'grey',
        nodeBorderColor: 'grey',
        edgeColor: 'grey',
        titleColor: 'black',
        separatorColor: '#424242'
    },
    light: {
        edgeColor: '#888',
        nodeBackgroundColor: "#fdfdfd",
        inputBackgroundColor: "white",
        secondaryBackground: '#E7E7E7',
        textColor: "#19191A",
        interactiveColor: "#009AFB",
        interactiveHoverColor: '#CEE7FE',
        interactiveHoverColorDarken: '#2773BC',
        borderColor: '#888',
        dataOutputColor: 'black',
        blockPort: '#fefefe',
        flowPort: '#fefefe',
        dataPort: '#fefefe',
        nodeBorderColor: '#aaa',
        disableTextColor: '#acacac',
        separatorColor: '#D4D4D4',
        titleColor: '#222',
    }
}

export default theme

export const useUITheme = (key: themeKey, defaultValue = null) => {
    const { resolvedTheme } = useThemeSetting();
    const _theme = { ...theme[resolvedTheme]}
    try {
        const value = _theme[key]
        return value
    } catch (e) {
        return defaultValue
    }

}