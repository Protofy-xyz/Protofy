import React, { useEffect } from "react";
import { SketchPicker, GithubPicker } from "react-color";
import { useThemeStore } from "../../store/ThemeStore";
import { getWeight, toColor } from "../conf";
import { colorsOrder } from '../../utils/utils'

const useOutsideClick = (callback) => {
    const ref = React.useRef();

    React.useEffect(() => {
        const handleClick = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [ref]);
    return ref;
};

const ColorPicker = ({ color, onChange, type, style, caption }) => {
    const selectedTheme = useThemeStore(state => state.selectedTheme);
    const theme = useThemeStore(state => state.theme)
    const pickerVisible = useThemeStore(state => state.pickerVisible)
    const setPickerVisible = useThemeStore(state => state.setPickerVisible)
    const menuVisible = pickerVisible == caption ? true : false
    const [colors, setColors] = React.useState({})
    const visibleColors = theme.protofy?.visibleColors

    const handleClickOutside = () => {
        setPickerVisible("")
    };
    const ref = useOutsideClick(handleClickOutside);

    const onMenuPress = () => {
        if (pickerVisible == "") setPickerVisible(caption)
        else setPickerVisible("")
    }

    const themeColors = !visibleColors ? Object.keys(theme.colors) : Object.keys(theme.colors).filter(key => visibleColors.includes(key))

    useEffect(() => {
        var newColors = {}
        themeColors.reduce((total, key) => {
            if (!theme.colors[key][getWeight(key)]) return
            newColors[theme.colors[key][getWeight(key)].toUpperCase()] = key
            return newColors
        }, {})
        var col = { ...newColors }
        setColors(col)
    }, [selectedTheme, theme])
    
    return <>
        <div
            style={{ width: '25px', height: '25px', position: 'relative', top: '-5px', borderRadius: '8px', backgroundColor: 'white', ...style }}
            onClick={onMenuPress}
        >
        </div>
        {menuVisible ? <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '30px', left: '0px', zIndex: 2 }} ref={ref}>
                {type == "color" || type == "colorAndThemeColor"
                    ? <SketchPicker
                        disableAlpha
                        color={toColor(color, theme)}
                        presetColors={Object.keys(colors).sort((a, b) => {
                            let valueA = colorsOrder.indexOf(colors[a])
                            let valueB = colorsOrder.indexOf(colors[b])
                            valueA = valueA < 0 ? colorsOrder.length : valueA
                            valueB = valueB < 0 ? colorsOrder.length : valueB
                            return valueA - valueB
                        })}
                        onChangeComplete={color => {
                            var tmpColor = colors[color.hex.toUpperCase()] ?? color.hex
                            if(type == 'colorAndThemeColor'){
                                tmpColor = color.hex
                            }
                            onChange(tmpColor)
                        }}
                        width={'162px'}
                    />
                    : <GithubPicker
                        colors={Object.keys(colors).sort((a, b) => {
                            let valueA = colorsOrder.indexOf(colors[a])
                            let valueB = colorsOrder.indexOf(colors[b])
                            valueA = valueA < 0 ? colorsOrder.length : valueA
                            valueB = valueB < 0 ? colorsOrder.length : valueB
                            return valueA - valueB
                        })}
                        onChangeComplete={color => {
                            onChange(colors[color.hex.toUpperCase()] ?? color.hex)
                        }}
                        width={'162px'}
                    />
                }
            </div>
        </div> : null}
    </>
}

export default ColorPicker