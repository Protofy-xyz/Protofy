import React, { useContext, useState } from 'react';
import useTheme from '../diagram/Theme';
import Text from '../diagram/NodeText'
import { FlowStoreContext } from '../store/FlowsStore';
import { GithubPicker, SketchPicker } from "react-color";
import Input from '../diagram/NodeInput'
import { Popover } from 'tamagui'
import { Pipette, Palette } from '@tamagui/lucide-icons'
import { CustomField } from '.';
import { useThemeSetting } from '@tamagui/next-theme'
import { getDataFromField, getFieldValue } from '../utils';

const ToggleItem = ({ onPress = (e) => { }, selected = false, ...props }) => (
    <div onClick={onPress}
        style={{
            padding: '5px',
            backgroundColor: selected ? useTheme('interactiveColor') : useTheme('inputBackgroundColor'),
            display: 'flex', alignContent: 'center',
            alignItems: 'center'
        }}
        {...props}>
    </div>
)

export const getColorTypes = () => ['color', 'color-theme']

export default ({ nodeData = {}, node, item }) => {
    const { resolvedTheme } = useThemeSetting();
    const resolvedThemeName = resolvedTheme ?? 'light'
    const THEMENAME = resolvedThemeName.charAt(0).toUpperCase() + resolvedThemeName.slice(1)
    const lvlAndName = '10' + THEMENAME

    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const metadata = useFlowsStore(state => state.metadata)

    const themeColors = metadata?.tamagui?.color
    const nodeFontSize = useTheme('nodeFontSize')
    const textColor = useTheme('textColor')

    const tones = ['blue', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'yellow']

    const { field, label, type, menuActions } = item

    const value = getFieldValue(field, nodeData)

    const [tmpColor, setTmpColor] = useState(value)
    const [menuOpened, setMenuOpened] = React.useState(false)

    const getColorPreview = () => {
        if (!value) return ''
        if (type == 'color-theme') return themeColors[value + lvlAndName]?.val
        else return themeColors[value + THEMENAME]?.val ?? value
    }

    const pickerStyles = { default: { card: { background: 'transparent', border: '0px', boxShadow: 'none' } } }

    const onSubmitThemeColor = (col) => {
        if (!col) return
        setNodeData(node.id, { ...nodeData, [field]: getDataFromField(col, field, nodeData) })

        setTmpColor(col)
    }


    const getInput = () => {
        switch (type) {
            case 'color-theme':
                const themeColors2 = tones.map(t => themeColors[t + lvlAndName]?.val)

                return <>
                    <div style={{ width: '100%', padding: '6px' }}>
                        <Text style={{ fontFamily: 'Jost-Medium', fontSize: '16px', paddingLeft: 0, alignSelf: 'flex-start' }}>Choose a Theme</Text>
                    </div>
                    <GithubPicker
                        styles={pickerStyles}
                        triangle='hide'
                        onChangeComplete={val => {
                            const valToFind = hslaToString(val.hsl)
                            const matchedKey = Object.keys(themeColors).find(colorKey => themeColors[colorKey].val == valToFind && colorKey.endsWith(lvlAndName) && !colorKey.startsWith('$'))
                            const newColor = matchedKey?.replace(lvlAndName, '')
                            onSubmitThemeColor(newColor ?? val.hex)
                        }}
                        width={'220px'}
                        colors={themeColors2}
                    />
                </>
            case 'color':
            default:
                const [colorMode, setColorMode] = React.useState('theme');
                const colorList = tones.map(t => Object.keys(themeColors).filter(c => c.startsWith(t) && c.endsWith(THEMENAME)).map(c => themeColors[c].val)).flat(1) // [[], []]
                return <>
                    <div style={{ height: '380px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: '6px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Text style={{ fontFamily: 'Jost-Medium', fontSize: '16px', paddingLeft: 0 }}>Choose a Color</Text>
                                <Text style={{ color: 'gray', fontSize: '14px', paddingLeft: 0, textAlign: 'left' }} >{colorMode == 'theme' ? 'Theme Color' : 'Custom Color'}</Text>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', borderRadius: '6px', overflow: 'hidden', height: '28px' }}>
                                <ToggleItem selected={colorMode == 'theme'} onPress={() => setColorMode('theme')}>
                                    <Palette size={'16px'} color={useTheme('textColor')} fillOpacity={0} />
                                </ToggleItem>
                                <ToggleItem selected={colorMode == 'custom'} onPress={() => setColorMode('custom')}>
                                    <Pipette size={'16px'} color={useTheme('textColor')} fillOpacity={0} />
                                </ToggleItem>
                            </div>
                        </div>
                        {colorMode == 'theme'
                            ?
                            <div style={{ height: '280px', marginTop: '5px', overflowY: 'scroll' }}>
                                <GithubPicker
                                    styles={pickerStyles}
                                    triangle='hide'
                                    onChangeComplete={val => {
                                        const valToFind = hslaToString(val.hsl)
                                        const matchedKey = Object.keys(themeColors).find(colorKey => themeColors[colorKey].val == valToFind && colorKey.endsWith(THEMENAME))
                                        const newColor = matchedKey?.replace(THEMENAME, '')
                                        onSubmitThemeColor(newColor ?? val.hex)
                                    }}
                                    width={'220px'}
                                    colors={colorList}
                                />
                            </div>
                            : <SketchPicker
                                color={tmpColor}
                                onChangeComplete={(newColor) => {
                                    onSubmitThemeColor(newColor.hex)
                                }}
                                styles={{ default: { picker: { background: 'transparent', border: '0px', boxShadow: 'none', width: '210px' } } }}
                            />
                        }
                    </div>
                </>
        }
    }

    return <CustomField label={label} menuActions={menuActions} input={
        <>
            <Popover onOpenChange={setMenuOpened} open={menuOpened} placement="left-start">
                <Popover.Trigger>
                    <div
                        style={{
                            width: "28px", height: "28px", cursor: 'pointer',
                            backgroundColor: getColorPreview(),
                            borderRadius: 4, zIndex: 10, position: 'absolute', marginLeft: '5px',
                            border: !value ? '1px solid ' + textColor : '', top: '-13px'
                        }}
                    >
                    </div>
                </Popover.Trigger>
                <Popover.Content marginRight="20px" space={0} width='250px' shadowRadius={"$4"} shadowColor={"black"} shadowOpacity={0.6} bc={useTheme('nodeBackgroundColor')} >
                    {getInput()}
                </Popover.Content>
            </Popover>
            <Input
                onBlur={() => onSubmitThemeColor(tmpColor)}
                style={{
                    fontSize: nodeFontSize + 'px',
                    fontWeight: 'medium', paddingLeft: '38px'
                }}
                value={tmpColor}
                placeholder="default"
                onChange={t => setTmpColor(t.target.value)}
            />
        </>
    } />

}

function hslaToString(colorHSLA) {
    const { h, s, l, a } = colorHSLA;

    const hValue = Math.round(h);
    const sValue = s == 1 ? 100 : (s * 100).toFixed(1);
    const lValue = (l * 100).toFixed(1);

    const hslaString = `hsl(${hValue}, ${sValue}%, ${lValue}%)`//, ${aValue})`;

    return hslaString;
}
