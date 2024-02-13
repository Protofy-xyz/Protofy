import React, { useContext, useState } from 'react';
import useTheme from '../diagram/Theme';
import Text from '../diagram/NodeText'
import { FlowStoreContext } from '../store/FlowsStore';
import { GithubPicker, SketchPicker } from "react-color";
import Input from '../diagram/NodeInput'
import Popover from '../diagram/NodePopover';
import { Pipette, Palette } from 'lucide-react'

export const getColorProps = () => [
    "color", "bgColor"
]

const ToggleItem = ({ onPress = (e) => { }, selected = false, ...props }) => (
    <div onClick={onPress}
        style={{
            padding: '5px',
            backgroundColor: selected ? '#EBEBEB' : '#F8F8F8',
            display: 'flex', alignContent: 'center',
            alignItems: 'center'
        }}
        {...props}>
    </div>
)

export default ({ nodeData = {}, field, node }) => {
    const rawThemeName = 'dark'
    const THEMENAME = rawThemeName.charAt(0).toUpperCase() + rawThemeName.slice(1)

    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const metadata = useFlowsStore(state => state.metadata)

    const colors = metadata?.tamagui?.color
    const nodeFontSize = useTheme('nodeFontSize')
    const interactiveColor = useTheme('interactiveColor')

    const tones = ['blue', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'yellow']

    const colorArrs = tones.map(t => Object.keys(colors).filter(c => c.startsWith(t) && c.endsWith(THEMENAME)).map(c => colors[c].val)) // [[], []]

    const dataKey = 'prop-' + field
    const data = nodeData[dataKey]
    const value = data?.value

    const [colorMode, setColorMode] = React.useState('theme');
    const [tmpColor, setTmpColor] = useState(value)

    const pickerStyles = { default: { card: { background: 'transparent', border: '0px', boxShadow: 'none' } } }

    const onSubmitThemeColor = (col) => {
        if (!col) return
        setNodeData(node.id, { ...nodeData, [dataKey]: { ...data, key: field, value: col, kind: 'StringLiteral' } })
        setTmpColor(col)
    }


    const getInput = () => {
        switch (field) {
            case 'color':
            case 'bgColor':
                return <>
                    <Popover trigger={
                        <div
                            style={{
                                width: "28px", height: "28px", cursor: 'pointer',
                                backgroundColor: colors[value + THEMENAME]?.val ?? value,
                                borderRadius: 4, zIndex: 10, position: 'absolute', marginLeft: '5px',
                                border: !value ? '1px solid white' : '', top: '13px'
                            }}
                        >
                        </div>
                    }
                    >
                        <div>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: '6px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Text style={{ color: 'black', fontFamily: 'Jost-Medium', fontSize: '16px', paddingLeft: 0 }}>Choose a Color</Text>
                                    <Text style={{ color: 'gray', fontSize: '14px', paddingLeft: 0, textAlign: 'left' }} >{colorMode == 'theme' ? 'Theme Color' : 'Custom Color'}</Text>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', borderRadius: '6px', border: '1px solid #cccccc', overflow: 'hidden', height: '28px' }}>
                                    <ToggleItem selected={colorMode == 'theme'} onPress={() => setColorMode('theme')}>
                                        <Palette size={'16px'} color={colorMode == 'theme' ? interactiveColor : 'gray'} fillOpacity={0} />
                                    </ToggleItem>
                                    <ToggleItem selected={colorMode == 'custom'} onPress={() => setColorMode('custom')}>
                                        <Pipette size={'16px'} color={colorMode == 'custom' ? interactiveColor : 'gray'} fillOpacity={0} />
                                    </ToggleItem>
                                </div>
                            </div>
                            {colorMode == 'theme'
                                ?
                                <div style={{ height: '280px', marginTop: '5px', overflowY: 'scroll' }}>
                                    <GithubPicker
                                        className={"loooll"}
                                        styles={pickerStyles}
                                        triangle='hide'
                                        onChangeComplete={val => {
                                            const valToFind = convertirHSLAString(val.hsl)
                                            const matchedKey = Object.keys(colors).find(colorKey => colors[colorKey].val == valToFind && colorKey.endsWith(THEMENAME))
                                            const newColor = matchedKey?.replace(THEMENAME, '')
                                            onSubmitThemeColor(newColor ?? val.hex)
                                        }}
                                        width={'220px'}
                                        colors={colorArrs.flat(1)}
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
        }
    }
    return <div style={{ alignItems: 'stretch', flexBasis: 'auto', flexShrink: 0, listStyle: 'none', position: 'relative', display: 'flex', flexDirection: "column" }}>
        <div style={{ fontSize: nodeFontSize + 'px', padding: '8px 15px 8px 15px', display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
            <div className={"handleKey"} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text>{field}</Text>
            </div>
            <div className={"handleValue"} style={{ minWidth: '180px', marginRight: '10px', display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'center' }}>
                {getInput()}
            </div>
        </div>
    </div>
}

function convertirHSLAString(colorHSLA) {
    const { h, s, l, a } = colorHSLA;

    const hValue = Math.round(h);
    const sValue = s == 1 ? 100 : (s * 100).toFixed(1);
    const lValue = (l * 100).toFixed(1);

    const hslaString = `hsl(${hValue}, ${sValue}%, ${lValue}%)`//, ${aValue})`;

    return hslaString;
}
