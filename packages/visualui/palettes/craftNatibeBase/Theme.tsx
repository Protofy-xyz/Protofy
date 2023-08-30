import React from "react";
import { useNode } from "@craftjs/core";
import { Conf } from "visualui/components/conf";
import { useThemeStore } from "visualui/store/ThemeStore";
import { Select, MenuItem } from "@mui/material";
import { availableThemes } from "visualui/themes";
import { theme as protofyTheme } from 'internalapp/theme'
import { colorsOrder } from 'visualui/utils/utils'
import { themeTranslations } from 'visualui/utils/translations'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from "native-base";

const Theme = ({ children, style, color }) => {
    const { connectors: { connect, drag }, hasSelectedNode, actions: { setProp } } = useNode((state) => ({
        hasSelectedNode: state.events.selected
    }));
    
    return <div style={{ width: 0, height: 0, backgroundColor: 'transparent' }}>
    </div>
}

const ThemeSettings = () => {
    const theme = useThemeStore(state => state.theme)
    const setCustomColors = useThemeStore(state => state.setCustomColors)
    const setSelectedTheme = useThemeStore(state => state.setSelectedTheme)
    const selectedTheme = useThemeStore(state => state.selectedTheme)
    const setFontSizes = useThemeStore(state => state.setFontSizes)
    const fontSizes = useThemeStore(state => state.fontSizes)
    const visibleColors = theme.protofy?.visibleColors
    const visibleFontSizes = theme.protofy?.visibleFontSizes
    const themeColors = !visibleColors ? Object.keys(theme.colors??{}) : Object.keys(theme.colors??{}).filter(key => visibleColors.includes(key))
    const themeFontSizes = !visibleFontSizes ? Object.keys(theme.fontSizes??{}) : Object.keys(theme.fontSizes??{}).filter(key => visibleFontSizes.includes(key))
    const { actions: { setProp, setCustom }, props, custom } = useNode((node) => ({
        props: node.data.props,
        custom: node.data.custom
    }));
    const onChangeColor = (newThemeColors, color) => {
        const obj = {
            600: null
        }
        setCustomColors(color, newThemeColors(obj))
    }
    const onChangeFontSize = (newThemeFontSize, size) => {
        const obj = {}
        setFontSizes(size, newThemeFontSize(obj))
    }
    const fontSizedObj = {
        ...theme.fontSizes,
        ...fontSizes
    }

    return (<div style={{ overflowY: 'auto', overflowX: 'hidden', height: '75vh', paddingRight: '5px' }}>
        <Select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
            style={{ padding: 0, height: '35px', position: 'absolute', right: '20px', top: '23px', fontFamily: protofyTheme.fonts.regular.fontFamily, color: '#cccccc', fontSize: 14, borderRadius: '14px' }}
            IconComponent={() => (
                <MaterialCommunityIcons
                    name="chevron-down"
                    color={'#CCCCCC'}
                    style={{ paddingRight: 10 }}
                    size={22}
                />
            )}
        >
            {availableThemes.map((param, i) => <MenuItem key={i} style={{ fontFamily: protofyTheme.fonts.regular.fontFamily, fontSize: 14 }} value={param}>{param}</MenuItem>)}
        </Select>
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0px 15px 20px 0px', width: '300px' }}>
            <Text color={"warmGray.500"} fontWeight={'400'}>Colors</Text>
        </div>
        {
            themeColors.sort((a, b) => {
                let valueA = colorsOrder.indexOf(a)
                let valueB = colorsOrder.indexOf(b)
                valueA = valueA < 0 ? colorsOrder.length : valueA
                valueB = valueB < 0 ? colorsOrder.length : valueB
                return valueA - valueB
            }).map((color, index) => theme.colors[color] && theme.colors[color]['600'] ? <Conf key={index} caption={color} type={'colorAndThemeColor'} prop={'600'} props={theme.colors[color]} setProp={(newThemeColors) => onChangeColor(newThemeColors, color)} setCustom={setCustom} custom={custom}/> : null)
        }
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0px 15px 20px 0px', width: '300px' }}>
            <Text color={"warmGray.500"} fontWeight={'400'}>Font Size</Text>
        </div>
        {
            themeFontSizes?.reverse().map((size, index) => <Conf key={index} caption={themeTranslations[size] ?? size} type={'number'} prop={size} props={fontSizedObj} setProp={(newThemeFontSize) => onChangeFontSize(newThemeFontSize, size)} setCustom={setCustom} custom={custom} />)
        }
    </div>
    )
};

Theme.craft = {
    related: {
        settings: ThemeSettings
    },
    props: {},
}

export default Theme