import React, { useContext, useState } from 'react';
import useTheme from '../diagram/Theme';
import Text from '../diagram/NodeText'
import { FlowStoreContext } from '../store/FlowsStore';
import { GithubPicker } from "react-color";
import Input from '../diagram/NodeInput'

export const getColorProps = () => [
    "color"
]

const THEMEMODE = 'Dark'

export default ({ nodeData = {}, field, node }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const metadata = useFlowsStore(state => state.metadata)

    // const colors = Object.keys(metadata?.tamagui?.color ?? {}).filter(item => item.startsWith("$")).map(k => metadata?.tamagui?.color[k].val)
    const colors = metadata?.tamagui?.color
    const nodeFontSize = useTheme('nodeFontSize')

    const tones = ['blue', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'yellow']
    const colorArrs = tones.map(t => Object.keys(colors).filter(c => c.startsWith(t) && c.endsWith(THEMEMODE)).map(c => colors[c].val)) // [[], []]

    const dataKey = 'prop-' + field
    const data = nodeData[dataKey]
    const value = data?.value

    const [colorPickerVisible, setColorPickerVisible] = React.useState(false);
    const [tmpColor, setTmpColor] = useState(value)

    const onSubmitThemeColor = (col) => {
        setNodeData(node.id, { ...nodeData, [dataKey]: { ...data, key: field, value: col, kind: 'StringLiteral' } })
        setTmpColor(col)
    }

    const getInput = () => {
        switch (field) {
            case 'color':
                return <div style={{ gap: '10px', display: 'flex', alignItems: 'center' }}>
                    <div
                        onClick={() => setColorPickerVisible(!colorPickerVisible)}
                        style={{
                            width: "28px", height: "28px", cursor: 'pointer',
                            backgroundColor: colors[value + THEMEMODE]?.val ?? value,
                            borderRadius: 4, zIndex: 10, position: 'absolute', marginLeft: '5px'
                        }}>
                    </div>
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
                    <div style={{ cursor: "pointer", position: "absolute", zIndex: 900000, top: '50px', marginLeft: '-90px' }}>
                        {colorPickerVisible
                            ? <GithubPicker
                                triangle='hide'
                                onChangeComplete={val => {
                                    const valToFind = convertirHSLAString(val.hsl)
                                    const matchedKey = Object.keys(colors).find(colorKey => colors[colorKey].val == valToFind && colorKey.endsWith(THEMEMODE))
                                    const newColor = matchedKey.replace(THEMEMODE, '')
                                    onSubmitThemeColor(newColor)
                                    setColorPickerVisible(false)
                                }}
                                width={'320px'}
                                colors={colorArrs.flat(1)}
                            />
                            : null
                        }
                    </div>
                </div>
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
