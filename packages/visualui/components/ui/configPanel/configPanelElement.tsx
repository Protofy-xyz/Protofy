import React, { } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { spanStyle, fullWidthElementStyle, containerStyle } from './styles';
import ColorPicker from "../../ui/ColorPicker";
import systemTheme from "baseapp/core/themes/protofyTheme";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Switch, Text } from "native-base";
import { cssAcceptsPixels } from "../../../utils/cssProperties"
import Color from "../../../../../lib/Color";
import { types, dumpValue, loadValue } from "../../../utils/utils";

const space = 10
const padding = 30
const jostRegular = systemTheme.fontConfig.Jost['400'].normal
const extraStyle = { ...fullWidthElementStyle, height: '35px' }

const Conf = ({ caption, type, prop, props, setProp, custom, setCustom, params, style, defaultValue = undefined }) => {
    const propType = custom && custom[prop] ?
        custom[prop] :
        'StringLiteral'

    const [field, setField] = React.useState(caption ?? '')
    const [val, setVal] = React.useState(prop ?? '')
    const [valueType, setValueType] = React.useState<string>(propType)
    // Set values
    var value;
    if (type !== 'extraProp' && type !== 'extraStyle') {
        if (style) {
            value = (typeof (props["style"]) == 'object') ?
                props["style"][prop]
                : JSON.parse(loadValue(props["style"], 'JsxExpression'))[prop] // inline style prop
        } else {
            value = loadValue(props[prop], propType) // normal prop
        }
        if (value == undefined) value = defaultValue
    }

    const modifyProp = (prop, value, modtype?) => { // TODO value of extraStyle only can be string
        value = type == 'number' ? Number(value) : value; // Convert to number if type is number
        if (style) {
            const newStyle = JSON.stringify({
                ...props.style ? (typeof (props["style"]) == 'object') ?
                    props["style"]
                    : JSON.parse(loadValue(props["style"], 'JsxExpression')) : {},
                [prop]: value
            })
            const newStyleJsx = dumpValue(newStyle, 'JsxExpression')
            setProp(props => props["style"] = newStyleJsx)
            setCustom(custom => custom["style"] = "JsxExpression")
        }
        else {
            modtype = modtype ?? propType
            setProp(props => props[prop] = dumpValue(value, modtype))
            setCustom(custom => custom[prop] = modtype)
        }
    }

    const addProps = () => {
        modifyProp(field, val, valueType)
        setField('')
        setVal('')
    }

    const deleteProp = () => {
        if (style) {
            let newStyle = JSON.parse(loadValue(props["style"], 'JsxExpression'))
            delete newStyle[prop]
            newStyle = JSON.stringify(newStyle)
            const newStyleJsx = dumpValue(newStyle, 'JsxExpression')
            setProp(props => props["style"] = newStyleJsx)
        } else {
            setProp(props => {
                delete props[prop]
                return props
            })
            setCustom(custom => {
                delete custom[prop]
                return custom
            })
        }
    }

    const iconTable = {
        add: {
            name: "check",
            size: 20,
            color: '#0795fc',
            action: addProps
        },
        delete: {
            name: "close",
            size: 20,
            color: 'white',
            action: deleteProp
        },
        help: {
            name: "help",
            size: 16,
            color: 'white',
            style: { textAlign: 'center', padding: 3, textAlignVertical: 'center' },
            action: () => window.open(!caption ? 'https://www.w3schools.com/jsref/dom_obj_style.asp' : ('https://www.w3schools.com/jsref/prop_style_' + caption + '.asp')).focus()
        },
        propType: {
            name: types[valueType].icon,
            size: 16,
            color: 'white',
            style: { textAlign: 'center', padding: 3, textAlignVertical: 'center' },
            action: () => {
                const optionArr = Object.keys(types);
                const nextIndex = optionArr.indexOf(valueType) + 1
                const nextElement = optionArr[nextIndex % optionArr.length];
                setValueType(nextElement)
            }
        }
    }

    const getIcon = (icon: string) => {
        const iconInfo = iconTable[icon]
        return <div style={{ position: 'absolute', left: icon == "propType" ? '5px' : "", right: icon != "propType" ? '5px' : "", backgroundColor: icon == 'help' || 'propType' ? 'transparent' : '#252526', marginTop: '-6px', padding: '3px', borderRadius: '10px' }}>
            {
                iconInfo ?
                    <MaterialCommunityIcons
                        name={iconInfo.name}
                        color={iconInfo.color}
                        size={iconInfo.size}
                        style={iconInfo?.style}
                        onPress={iconInfo?.action}
                    />
                    : null
            }
        </div>
    }

    const getPlaceHolder = () => {
        if (cssAcceptsPixels[field]) return 'Value + px'
        else return 'Value'
    }

    switch (type) {
        case 'text':
        case 'textAI':
        case 'number':
            const finalStyle = {
                ...fullWidthElementStyle
            }
            if (type == 'number') {
                finalStyle["textAlign"] = 'center'
            }
            return <FormControl component="fieldset">
                <div style={containerStyle}>
                    <div style={{ ...spanStyle }} title={caption}>{caption.replace(/(.{13})..+/, "$1…")}</div>
                    <input
                        onChange={(e) => modifyProp(prop, e.target.value, type == 'number' ? 'JsxExpression' : propType)}
                        type="text"
                        style={{ ...finalStyle, height: '35px', paddingRight: '35px' }}
                        placeholder={type == 'textAI' ? 'AI Generated Text' : 'Value'}
                        value={value}
                    />
                    {params ? getIcon(params) : null}
                </div>
            </FormControl>
        case 'select':
            value = value ?? params[0].value
            return <FormControl size="small" component="fieldset">
                <div style={containerStyle}>
                    <div title={caption} style={{ ...spanStyle }}>{caption}</div>
                    <Select
                        value={value}
                        onChange={(e) => modifyProp(prop, e.target.value)}
                        style={{ ...fullWidthElementStyle, padding: 0, border: '0px', height: '35px' }}
                    >
                        {params.map((param, i) => <MenuItem key={i} value={param.value}><Text isTruncated color={param.value == value ? "warmGray.300" : "black"}>{param.caption}</Text></MenuItem>)}
                    </Select>
                </div>
            </FormControl>
        case 'color':
        case 'colorAndThemeColor':
        case 'themeColor':
            const disabled = (type != "color" || !value.startsWith('#'))
            const [textColor, setTextColor] = React.useState(value)
            const isHexColor = (hex) => {
                if (hex.startsWith('#')) hex = hex.substring(1)
                return typeof hex === 'string' && hex.length === 6 && !isNaN(Number('0x' + hex))
            }
            const onBlur = () => {
                if (!isHexColor(textColor)) return setTextColor(value)
                else modifyProp(prop, textColor)
            }
            React.useEffect(() => {
                setTextColor(value)
            }, [value])
            return <FormControl component="fieldset">
                <div id="color" style={{ ...containerStyle, marginBottom: '24px' }}>
                    <div title={caption} style={spanStyle}>{caption}</div>
                    <ColorPicker
                        style={{ position: 'absolute', left: spanStyle.width + 6 }}
                        color={value}
                        caption={caption}
                        onChange={color => {
                            if (type != 'themeColor' && !isHexColor(color)) {
                                modifyProp(prop, color + '.' + Color.parse(color).getWeight(), 'StringLiteral')
                            } else {
                                modifyProp(prop, color, "StringLiteral")
                            }
                            setTextColor(color)
                        }}
                        type={type} />
                    <input
                        disabled={disabled}
                        maxLength={7}
                        onBlur={onBlur}
                        onChange={(e) => setTextColor(e.target.value)}
                        type="text"
                        style={{ ...fullWidthElementStyle, height: '35px', outlineColor: 'transparent', outlineWidth: '0px', paddingLeft: '38px' }}
                        value={disabled ? textColor : textColor.toUpperCase()}>
                    </input>
                </div>
            </FormControl>
        case 'toggle':
            value = (value === 'true')
            return <FormControl component="fieldset">
                <div style={{ ...containerStyle, width: '310px' }}>
                    <div title={caption} style={spanStyle}>{caption}</div>
                    <Switch onToggle={() => modifyProp(prop, !value, "JsxExpression")} value={value} />
                    <span style={{ width: '100px' }}>
                        {params ? getIcon('delete') : null}
                    </span>
                </div>
            </FormControl>
        case "extraProp":
            return <FormControl component="fieldset">
                <div style={containerStyle}>
                    <input
                        placeholder="prop"
                        value={field}
                        onChange={(e) => setField(e.target.value)}
                        type="text"
                        style={{ ...extraStyle, width: spanStyle['width'] - space, marginRight: space, textAlign: 'center', paddingRight: padding, paddingLeft: padding }}
                    />
                    {getIcon('propType')}
                    <input
                        placeholder="value"
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        onKeyDown={(e) => e.code == 'Enter' && field ? addProps() : null}
                        type="text"
                        style={{ ...extraStyle, textAlign: 'center', paddingRight: padding, paddingLeft: padding }}
                    />
                    {(field && val) ? getIcon('add') : getIcon('help')}
                </div>
            </FormControl>
        case 'extraStyle':
            return <FormControl component="fieldset">
                <div style={containerStyle}>
                    {!field ? <InputLabel id="simple-select" color="primary" style={{ color: 'grey', marginTop: '-20px', fontFamily: jostRegular, fontSize: extraStyle.fontSize }}>Field</InputLabel> : null}
                    <Select
                        value={field}
                        labelId="simple-select"
                        onChange={(e) => setField(e.target.value)}
                        style={{ ...extraStyle, marginTop: '-12px', width: spanStyle['width'] - space, textAlign: 'right', marginRight: space, paddingRight: '10px' }}
                        MenuProps={{ style: { maxHeight: '70vh', top: '-15vh' } }}
                    >
                        {params.map((param, i) => <MenuItem style={{ fontFamily: jostRegular }} key={i} value={param}>{param}</MenuItem>)}
                    </Select>
                    <input
                        placeholder={getPlaceHolder()}
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        onKeyDown={(e) => e.code == 'Enter' && field ? addProps() : null}
                        type="text"
                        style={{ ...extraStyle, textAlign: 'center', paddingRight: padding, paddingLeft: padding }}
                    />
                    {(field && val) ? getIcon('add') : getIcon('help')}
                </div>
            </FormControl>
        default:
            return <></>
    }
}
export default Conf