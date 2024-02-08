import React, { useContext, useEffect } from 'react';
import { Handle, Position, useEdges, useReactFlow } from 'reactflow';
import Input from './diagram/NodeInput'
import Text from './diagram/NodeText'
import { nodeColors } from './nodes';
import { PORT_TYPES } from './lib/Node';
import getCustomComponent from './nodes/custom';
import Select, { components } from 'react-select';
import DiagramNode, { NodePort, NodePortProps, isHandleConnected, isNodeConnected } from './diagram/Node'
import { withTopics } from "react-topics";
import { FlowStoreContext } from "./store/FlowsStore";
import { DEVMODE, flowDirection } from './toggles';
import { SketchPicker } from "react-color";
import useTheme from './diagram/Theme';
import { DataOutput } from './lib/types';
import { read } from './lib/memory';
import NodeSelect from './diagram/NodeSelect';
import { X, ChevronUp, AlertCircle, Type, Hash, Braces, ToggleLeft } from 'lucide-react';

export interface Field {
    field: string,
    type: 'input' | 'output' | 'select' | 'error' | 'boolean' | 'range' | 'color' | 'colorPicker',
    description?: string,
    label?: string,
    data?: any
    static?: boolean,
    fieldType?: string | 'parameter' | 'child' | 'prop' | 'clause',
    additionalHandlePort?: string,
    deleteable?: boolean,
    pre?: any,
    post?: any,
    keyPre?: any,
    keyPost?: any,
    error?: string,
    isDisabled?: boolean,
    onBlur?: Function,
    lowercase?: boolean,
    separator?: string | ':' | '='
}


export const isDataPortConnected = (id, port, edges) => edges.find(e => e.targetHandle == `${id}${PORT_TYPES.data}${port}`)

export const headerSize = 55;

export const DeleteButton = ({ id, left = false, field }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const deletePropNodeData = useFlowsStore(state => state.deletePropNodeData)
    const onDeleteParam = () => {
        deletePropNodeData(id, field);
    }

    return <div id={'deleteButton-' + id + field} style={{ display: 'flex', alignSelf: 'center', cursor: 'pointer' }} onClick={onDeleteParam}>
        <X size={useTheme('nodeFontSize')} color={useTheme("colorError")} style={{ marginRight: left ? '7px' : '2px' }} />
    </div>
}


export const NodeInput = ({ id, disabled, post = (t) => t, pre = (t) => t, onBlur, field, children, style = {}, editing = false }: any) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const { setNodes } = useReactFlow()
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const notify = useFlowsStore(state => state.dataNotify)
    var initialInputValue = pre(nodeData[field]);
    const [tmpInputValue, setTmpInputValue] = React.useState(initialInputValue)
    const nodeFontSize = useTheme('nodeFontSize')
    const ref = React.useRef();
    React.useEffect(() => {
        // console.log('editing: ', editing,)
        if (ref.current && editing) {
            //@ts-ignore
            ref.current?.focus()
        }
    }, [editing])

    const dataNotify = (data) => {
        notify({ ...data, notifyId: nodeData._dataNotifyId })
    }

    useEffect(() => {
        setTmpInputValue(initialInputValue)
    }, [nodeData[field]])

    const selecNodeOnFocus = () => {
        setNodes(nds => {
            let newNds = [...nds];
            newNds = newNds.map(n => {
                if (n.hasOwnProperty("selected")) {
                    delete n.selected;
                }
                return n
            })
            const nodeIndex = newNds.findIndex(n => n.id == id)
            newNds[nodeIndex] = { ...newNds[nodeIndex], selected: true }
            return newNds
        })
    }

    const _onBlur = () => {
        if (!disabled) {
            setNodeData(id, { ...nodeData, [field]: post(tmpInputValue) })
            dataNotify({ id: id, paramField: field, newValue: tmpInputValue })
        }
        if (onBlur) onBlur(tmpInputValue);
    }

    return (<div className={'nodrag'} style={{ flex: 1 }}>
        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} >
            <Input
                ref={ref}
                onFocus={selecNodeOnFocus}
                onBlur={_onBlur}
                readOnly={disabled}
                style={{
                    fontSize: nodeFontSize + 'px',
                    fontWeight: 'medium',
                    ...style
                }}
                value={tmpInputValue}
                placeholder="default"
                onChange={t => setTmpInputValue(t.target.value)}
            />
            {children}
        </div>
    </div>)
}

const HandleField = ({ id, param, index = 0, portId = null, editing = false, onRequestEdit = (param) => { }, onCancelEdit = () => { } }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const notify = useFlowsStore(state => state.dataNotify)
    const deletePropNodeData = useFlowsStore(state => state.deletePropNodeData)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const edges = useEdges();
    const isConnected = edges.find(e => e.targetHandle == `${id}${PORT_TYPES.data}${param.field}`)
    const isDeletedLeft = param.fieldType == 'child'
    const isParameter = param.fieldType == 'parameter'
    const isProp = param.fieldType == 'prop'

    const checkRef: any = React.useRef()
    const textBoxRef: any = React.useRef()
    const parentRef: any = React.useRef()

    const pre = param.pre ? param.pre : (str) => str
    const post = param.post ? param.post : (str) => str
    const keyPre = param.keyPre ? param.keyPre : (str) => str
    const keyPost = param.keyPost ? param.keyPost : (str) => str

    const dataNotify = (data) => {
        notify({ ...data, notifyId: nodeData._dataNotifyId })
    }

    const getInput = (disabled?) => {
        switch (param.type) {
            case 'select':
                const onChangeSelect = (data) => {
                    var tmpData = { [param.field]: (isProp || nodeData[param.field]?.value) ? { key: param.label, value: data?.value } : data?.value }
                    setNodeData(id, { ...nodeData, ...tmpData })
                    dataNotify({ id: id, paramField: param.field, newValue: data?.value })
                }
                const options = param.data?.map((item, index) => {
                    var extraProps = item?.color ? { color: item.color } : {}
                    return { label: item ?? "default", value: item, ...extraProps }
                })

                return <div style={{ flex: 1, zIndex: 1000 }}>
                    <NodeSelect
                        onChange={onChangeSelect}
                        defaultValue={{
                            value: (isProp || nodeData[param.field]?.value) ? nodeData[param.field]?.value : nodeData[param.field],
                            label: nodeData[param.field]?.value ?? nodeData[param.field]
                        }}
                        options={options} />
                </div>
            case 'select-multi':
                const onChangeSelectMulti = (data) => {
                    const dataValues = data.map(obj => obj.value.replace(/"/g, ''));
                    console.log("🚀 ~ file: Node.tsx:142 ~ onChangeSelectMulti ~ dataValues:", dataValues)
                    setNodeData(id, { ...nodeData, dataValues })
                    dataNotify({ id: id, paramField: param.field, newValue: dataValues })
                }
                const inputBorderMulti = useTheme("inputBorder");
                const textColorMulti = useTheme("textColor")
                const colourStylesMulti = {
                    control: (styles, state) => ({
                        ...styles,
                        backgroundColor: useTheme("inputBackgroundColor"),
                        borderColor: state.isSelected ? inputBorderMulti : "transparent",
                        textColor: textColorMulti,
                        width: 'fit-content'
                    }),
                    singleValue: (styles, { data }) => {
                        return ({
                            ...styles, fontSize: '12px', minWidth: '95px', textAlign: 'left', color: textColorMulti
                        })
                    },
                    menu: (styles) => {
                        return {
                            ...styles, color: textColorMulti,
                            backgroundColor: useTheme("inputBackgroundColor"),
                        }
                    },
                };
                const optionsMulti = param.data?.map((item, index) => {
                    var extraProps = item.color ? { color: item.color } : {}
                    return { label: item, value: item, ...extraProps }
                })
                const DropdownIndicatorMulti = props => {
                    return (
                        components.DropdownIndicator && (
                            <components.DropdownIndicator {...props}> <ChevronUp size={'15px'} /> </components.DropdownIndicator>
                        )
                    );
                };
                return <div style={{ zIndex: 1000 }}>
                    <Select
                        //@ts-ignore
                        components={{ DropdownIndicatorMulti }}
                        menuPlacement="top"
                        onChange={onChangeSelectMulti}
                        className={'nodrag'} options={optionsMulti} styles={colourStylesMulti}
                        isMulti={true} />
                </div>

            case 'colorPicker':
                const initColor = nodeData[param.field] ? pre(nodeData[param.field]) : "#404040"
                const [colorPickerVisible, setColorPickerVisible] = React.useState(false);
                return (<div style={{ cursor: "pointer" }}>
                    <div style={{ width: "36px", height: "36px", backgroundColor: initColor, border: colorPickerVisible ? borderWidth + " solid " + borderColor : "1px #cccccc solid", borderRadius: 5 }} onClick={() => { setColorPickerVisible(!colorPickerVisible) }}></div>
                    <div style={{ cursor: "pointer", position: "absolute", zIndex: 1100 }}>
                        {colorPickerVisible
                            ? <SketchPicker
                                className="nodrag"
                                color={initColor}
                                onChangeComplete={(newColor) => {
                                    dataNotify({ id: id, paramField: param.field, newValue: { r: newColor.rgb.r, g: newColor.rgb.g, b: newColor.rgb.b, a: newColor.rgb.a } })
                                    setNodeData(id, { ...nodeData, [param.field]: newColor.hex })
                                }}
                            />
                            : null
                        }
                    </div>
                </div>)
            case 'range':
                const min = param.data?.min ? param.data.min : 0
                const max = param.data?.max ? param.data.max : 100
                const step = param.data?.step
                const defaultValue = param.data?.defaultValue
                const initialRangeValue = nodeData[param.field]?.value ?? nodeData[param.field] ?? (defaultValue ?? min)
                const [tmpRangeValue, setTmpRangeValue] = React.useState(pre(initialRangeValue));
                return <>
                    <input type="range" style={{ width: '100%', marginTop: '6px', accentColor: useTheme('interactiveColor'), height: '5px', borderWidth: '4px solid blue', backgroundColor: useTheme("inputBackgroundColor"), borderRadius: '10px' }}
                        step={step}
                        onChange={(event: any) => setTmpRangeValue(event.target.value)}
                        onMouseUp={() => {
                            dataNotify({ id: id, paramField: param.field, newValue: tmpRangeValue });
                            setNodeData(id, { 
                                ...nodeData, [param.field]: isParameter || isProp ? 
                                    { 
                                        ...nodeData[param.field], 
                                        key: nodeData[param.field]?.key ?? param.label, 
                                        value: post(tmpRangeValue),
                                        kind: param.data?.kind ?? 'NumericLiteral'
                                    } 
                                    : post(tmpRangeValue) 
                            })
                        }}
                        value={tmpRangeValue} min={min} max={max} />
                    {!param.hideLabel ? <div style={{ fontSize: '14px', position: 'relative', top: '5px', left: '7px', marginRight: '-8px', width: '18px' }}>{post(tmpRangeValue)}</div> : null}
                </>
            case 'boolean':
                const stringToBolean = (myVar) => {
                    if (typeof myVar === 'string' || myVar instanceof String)
                        return myVar == "true" ? true : false;
                    else
                        return myVar;
                }
                const [checked, setChecked] = React.useState(stringToBolean(nodeData[param.field]));
                return <span ref={checkRef}>
                    <input type='checkbox'
                        onChange={() => {
                            dataNotify({ id: id, paramField: param.field, newValue: !checked });
                            setNodeData(id, { ...nodeData, [param.field]: !checked }),
                                setChecked(!checked)
                        }}
                        checked={checked ? true : false}
                        style={{ all: "revert", width: nodeFontSize, margin: "2px 0px 2px 0px", accentColor: useTheme("interactiveColor"), transform: `scale(${useTheme('nodeFontSize') / 15})`, marginRight: '5px' }} />
                </span>
            default:
                const type = nodeData[param.field]?.kind
                const icons = {
                    "StringLiteral": Type,
                    "NumericLiteral": Hash,
                    "TrueKeyword": ToggleLeft,
                    "ObjectLiteralExpression": Braces,
                    "FalseKeyword": ToggleLeft
                }
                return <>
                    {type && icons[type]
                        ? <div
                            style={{ padding: '8px', justifyContent: 'center', position: 'absolute', zIndex: 100, cursor: 'pointer' }}
                            onClick={() => {
                                setNodeData(id, {
                                    ...nodeData, [param.field]: {
                                        ...nodeData[param.field],
                                        kind: Object.keys(icons)[(Object.keys(icons).indexOf(type) + 1) % (Object.keys(icons).length - 1)]
                                    }
                                })
                            }}
                        >
                            {React.createElement(icons[type], { size: 16, color: useTheme('interactiveColor') })}
                        </div>
                        : <></>}
                    <NodeInput
                        id={id}
                        post={(v) => isParameter || isProp ? { ...nodeData[param.field], key: nodeData[param.field]?.key ?? param.label, value: post(v) } : post(v)}
                        pre={(v) => (v?.value ?? v) ?? ''}
                        field={param.field}
                        onBlur={param.onBlur}
                        disabled={disabled || param.isDisabled}
                        style={{
                            marginRight: ["case", "child"].includes(param.fieldType) ? "20px" : "0px",
                            paddingLeft: type && icons[type] ? "30px": undefined
                        }}>
                        {param.error ? <div style={{ alignItems: 'center', marginTop: '5px', display: 'flex' }}>
                            <AlertCircle size={"14px"} color='red' style={{ alignSelf: 'center', marginRight: '5px' }} />
                            <Text style={{ color: 'red', fontSize: '12px' }}>
                                {param.error}
                            </Text> </div> : null}
                    </NodeInput>
                </>
        }
    }
    const getValue = () => {
        let label = param?.label ?? param.field
        if ((isParameter || isProp) && !param.static) {
            label = keyPre(nodeData[param.field]?.key ?? '')

            if (editing) {
                return (<>
                    <NodeInput
                        editing={editing}
                        id={id}
                        post={(v) => {
                            return { key: keyPost(v), value: nodeData[param.field]?.value ?? "" }
                        }}
                        pre={() => keyPre(nodeData[param.field]?.key ?? '')}
                        field={param.field}
                        onBlur={(val) => {
                            if (val) {
                                onCancelEdit()
                            }
                        }}
                        style={{
                            marginRight: '16px'
                        }} />
                </>)
            }
        }
        return (
            <Text adaptiveSize={true} onClick={() => {
                if (isParameter || isProp) onRequestEdit(param)
            }} style={{ marginRight: '12px', textAlign: 'left', whiteSpace: 'nowrap', cursor: 'pointer' }}>{label ?? ' '}</Text>
        )
    }
    const isDefaultCase = (param.field == 'default')
    const isFlowParam = param.fieldType == 'call' || param.fieldType == 'clause'
    const borderColor = useTheme("borderColor");
    const borderWidth = useTheme("borderWidth");
    const handleBorderColor = useTheme("handleBorderColor");
    const dataOutputColor = useTheme('dataOutputColor');
    const dataPort = useTheme("dataPort");
    const nodeFontSize = useTheme('nodeFontSize')

    const ref = React.useRef()

    return (
        <div ref={parentRef} style={{ alignItems: 'stretch', flexBasis: 'auto', flexShrink: 0, listStyle: 'none', position: 'relative', display: 'flex', zIndex: param.type == 'select' || param.type == 'colorPicker' ? 1100 : 0, flexDirection: "column" }}>
            {
                !isDefaultCase ?
                    <div ref={ref} style={{ flex: 1, fontSize: nodeFontSize + 'px', padding: '8px 15px 8px 15px', display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}>
                        <div className={"handleKey"} ref={textBoxRef} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            {(param?.deleteable && isDeletedLeft) ? <DeleteButton id={id} left={true} field={param.field} /> : null}
                            {getValue()}
                        </div>
                        <div className={"handleValue"} title={param.description} style={{ minWidth: '180px', marginRight: '10px', display: 'flex', flexDirection: 'row', flexGrow: 1, justifyContent: param.type == 'boolean' ? 'flex-end' : '', alignItems: 'center' }}>
                            {getInput(isConnected)}
                            {(param?.deleteable && !isDeletedLeft) ? <DeleteButton id={id} field={param.field} /> : null}
                        </div>
                    </div>
                    : null
            }
            {
                param.additionalHandlePort ?
                    <NodePort
                        type={"target"}
                        style={{ top: '16px' }}
                        position={flowDirection == 'RIGHT' ? Position.Left : Position.Right}
                        id={`${(portId ?? id)}${PORT_TYPES.data}${param.field}${PORT_TYPES.data}${param.additionalHandlePort}`}
                        allowedTypes={["data"]}
                    />
                    : null
            }
            {!param.static && !isFlowParam ? <>
                <NodePort
                    position={flowDirection == 'RIGHT' ? Position.Left : Position.Right}
                    id={`${(portId ?? id)}${PORT_TYPES.data}${param.field}`}
                    label={""}
                    nodeId={id}
                    type={'target'}
                    style={{ marginTop: param.additionalHandlePort ? '14px' : "" }}
                    allowedTypes={["data"]}
                />
            </> : null}
            {param.type == 'error' ? <Handle
                type={"source"}
                title={DEVMODE ? `${(portId ?? id)}${PORT_TYPES.data}${param.field}` : undefined}
                style={{ width: "15px", height: "15px", backgroundColor: dataPort, marginRight: '-4px', border: borderWidth + "solid " + handleBorderColor }}
                position={flowDirection == 'RIGHT' ? Position.Left : Position.Right}
                id={`${(portId ?? id)}${PORT_TYPES.data}${param.field}`}
            /> : null}
            {param.fieldType == 'clause' ? <FlowPort
                id={`${(portId ?? id)}${PORT_TYPES.flow}${param.field}`}
                type='output'
                style={{ top: '26px' }}
                label={isDefaultCase ? 'Default' : undefined}
                isConnected={!!isConnected}
            />
                : null
            }
            {param.fieldType == 'call' ? <FlowPort
                id={id}
                handleId={'call'}
                type='input'
                style={{ top: '26px' }}
                isConnected={!!edges.find(e => e.targetHandle == `${id}${PORT_TYPES.flow}${param.field}`)}
            />
                : null
            }
        </div>
    )
}

export const HandleOutput = ({ id, param, position = null, style = {}, isConnected = false, dataOutput = DataOutput.data }) => {
    const { getEdges } = useReactFlow();
    const connected = isHandleConnected(getEdges(), `${id}${PORT_TYPES.data}output`)
    const backgroundColor = (dataOutput == DataOutput.data) ? useTheme('dataPort') : (dataOutput == DataOutput.block) ? useTheme('blockPort') : useTheme('flowPort')
    const useFlowsStore = useContext(FlowStoreContext)
    const instanceId = useFlowsStore(state => state.flowInstance)
    const portSize = useTheme('portSize')
    const borderColor = useTheme('nodeBorderColor')
    const borderWidth = useTheme('nodeBorderWidth')
    return (
        <div style={{ display: 'flex', flexDirection: 'column', zIndex: 222 }}>
            {param.label ? <div style={{ padding: '8px 15px 8px 15px', display: 'flex', flexDirection: 'row' }}>
                <Text style={{ marginRight: '12px' }}>{param.label}</Text>
            </div> : null}
            <Handle
                type={"source"}
                style={{ marginLeft: -portSize / 4, width: portSize + "px", height: portSize + "px", backgroundColor: backgroundColor, top: (portSize / 2) + 10, border: borderWidth + " solid " + borderColor, ...style }}
                position={position ?? (flowDirection == 'LEFT' ? Position.Left : Position.Right)}
                title={DEVMODE ? `${id}${PORT_TYPES.data}output` : undefined}
                id={`${id}${PORT_TYPES.data}output`}
                isConnectable={!connected}
                isValidConnection={(c) => {
                    const allowedTypes = read(instanceId, c.targetHandle, [])
                    if (allowedTypes.indexOf(dataOutput) == -1) return false
                    const sourceConnected = isHandleConnected(getEdges(), c.targetHandle)
                    return !sourceConnected
                }}
            />
        </div>
    )
}

export const NodeParams = ({ mode = 'column', id, params, boxStyle = {}, children = null, portId = null }) => {
    const [editing, setEditing] = React.useState('')
    const [currentParams, setCurrentParams] = React.useState(null)
    useEffect(() => {
        if (editing && !params || !params.length || !params.find((p) => p.field == editing)) setEditing('')
        if (currentParams !== null) {
            const newParam = params.find(p => !currentParams.includes(p.field))
            if (newParam) {
                setEditing(newParam.field)
            }
        }
        setCurrentParams(params.map(p => p.field))
    }, [params])
    //@ts-ignore
    return <div style={{ flex: 1, display: 'flex', flexDirection: mode, ...boxStyle }}>
        {params.map((param: Field, i) => {
            return <HandleField onCancelEdit={() => setEditing('')} editing={param.field == editing} onRequestEdit={(param) => !editing ? setEditing(param.field) : null} key={i} id={id} param={param} index={i} portId={portId} />
        })}
        {children}
    </div>
}

export const FlowPort = ({ id, type, style, handleId, label, isConnected = false, position = null, allowedTypes = ["block", "data", "flow"] }: NodePortProps) => {
    const _position = position ?? (flowDirection == 'RIGHT' ? Position.Left : Position.Right)
    return (<NodePort
        position={_position}
        id={`${id}${PORT_TYPES.flow}${handleId ?? type}`}
        type={type}
        style={{ ...style, marginLeft: _position == Position.Left ? -4 : 0 }}
        label={label}
        isConnected={isConnected}
        nodeId={id}
        allowedTypes={allowedTypes}
    />)
}

type OutputNodeType = DataOutput
interface NodeProps {
    title: string,
    isPreview: boolean,
    id: string,
    params?: Field[],
    output?: Field,
    children?: any,
    color?: string
    node?: any,
    skipCustom?: boolean,
    topics?: any,
    style?: any,
    container?: boolean,
    icon?: any,
    dataOutput?: OutputNodeType
    contentStyle?: any
    draggable?: boolean,
    mode?: 'column' | 'row',
    modeParams?: 'column' | 'row',
    adaptiveTitleSize?: boolean
}

const Node = ({ adaptiveTitleSize = true, modeParams = 'column', mode = 'column', draggable = true, icon = null, container = false, title = '', children, isPreview = false, id, params = [], output = { label: '', field: 'value', type: 'output' }, color = nodeColors['defaultColor'], node, skipCustom = false, topics, style = {}, dataOutput = DataOutput.data, contentStyle = {} }: NodeProps) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData[id] ?? {})
    const customComponents = useFlowsStore(state => state.customComponents)
    const edges = useEdges();
    const isConnected = isNodeConnected(edges, id)
    const content = React.useRef()

    if (!skipCustom) {
        const mask = getCustomComponent(node, nodeData, customComponents)
        const customComponent = mask?.getComponent(node, nodeData, topics, mask)
        //const customComponent = React.createElement(mask?.getComponent, { node, nodeData, topics, mask })
        if (customComponent) {
            return customComponent
        }
    }

    let disableOutput = false
    for (let child in children) {
        if (children[child]?.type?.name == 'HandleOutput') {
            disableOutput = true
        }
    }


    const extraStyle: any = {}
    if (!id) {
        extraStyle.minWidth = '200px';
    }
    if (node && node.data && node.data.width) extraStyle.minWidth = node.data.width + 'px'
    if (node && node.data && node.data.height) extraStyle.minHeight = node.data.height + 'px'

    if (node.id && !nodeData?._metadata?.layouted) extraStyle.opacity = '0'

    const computeLayout = () => {
        if (content.current) {
            //@ts-ignore
            const elements = content.current.querySelectorAll('.handleKey')

            let maxWidth = 0;

            // Itera sobre todos los elementos para encontrar el más ancho
            elements.forEach(key => {
                let width = key.firstElementChild.offsetWidth;
                if (width > maxWidth) {
                    maxWidth = width;
                }
            });

            // Aplica el ancho máximo a todos los elementos
            elements.forEach(key => {
                key.style.width = maxWidth + 15 + 'px';
            });
        }
    }

    useEffect(() => computeLayout(), [])

    return (
        <DiagramNode
            adaptiveTitleSize={adaptiveTitleSize}
            mode={mode}
            contentStyle={contentStyle}
            draggable={draggable}
            icon={icon}
            container={container}
            title={title}
            isPreview={isPreview}
            id={id}
            color={color}
            node={node}
            style={{
                ...style,
                ...extraStyle
            }}
            headerContent={<>{!disableOutput && !isPreview && output ? <HandleOutput id={id} param={output} dataOutput={dataOutput} /> : null}</>}
        >
            <div ref={content}>
                {DEVMODE ? <div>{id}</div> : null}
                {!isPreview && params ? <NodeParams mode={modeParams} id={id} params={params} /> : null}
                {!isPreview ? children : null}
            </div>

        </DiagramNode>
    )
}

export default withTopics(Node)