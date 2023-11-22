import React, { memo, useContext, useRef } from 'react';
import Text from "./NodeText"
import { Handle, Position } from 'reactflow';
import chroma from "chroma-js";
import { FlowStoreContext } from '../store/FlowsStore'
import { DEVMODE, flowDirection } from '../toggles'
import { useEdges } from 'reactflow';
import useTheme from './Theme';
import { NodeTypes } from './../nodes';
import { write } from '../lib/memory';
import { Plus } from 'lucide-react';
import { generateBoxShadow } from '../lib/shadow';
import { useHover } from 'usehooks-ts'

const Node = ({ adaptiveTitleSize = true, mode = 'column', draggable = true, icon = null, container = false, title = '', children, isPreview = false, id, color = 'white', node, headerContent = null, style = {}, contentStyle = {} }) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const errorData = useFlowsStore(state => state.errorData)
    const flexRef = React.useRef()
    const boxRef = React.useRef()
    const editingLayout = useFlowsStore(state => state.editingLayout)
    const isThemePreview = editingLayout == 'node'

    // const scale = chroma.scale([(chroma.scale([color, 'white']))(0.5).hex(), 'white']).mode('lab');

    const isError = id && id == errorData.id
    const isFloating = !id || id.indexOf('_') == -1
    const colorError = useTheme('colorError')
    color = isError ? colorError : (!isPreview && isFloating ? (chroma.scale([color, 'white']))(0.5).hex() : color)
    const hColor = (chroma.scale([color, 'black']))(0.6).hex()
    const tColor = useTheme('titleColor')
    const themeBorderColor = useTheme('borderColor')
    const borderColor = isError ? colorError : themeBorderColor
    const borderWidth = useTheme('borderWidth')
    const borderWidthSelected = useTheme('borderWidthSelected')
    const themeBackgroundColor = useTheme('nodeBackgroundColor')
    const isHover = useHover(flexRef)
    const currentBorder = isPreview ? 0 : (node?.selected ? borderWidthSelected : borderWidth)
    const titleSize = (useTheme('nodeFontSize') / 100) * 100

    const innerRadius = '12px '
    const innerBorderRadius = (mode == 'column' ? innerRadius + innerRadius + ' 0px 0px' : innerRadius + '0px 0px ' + innerRadius)

    return (
        <div
            id={id}
            ref={flexRef}
            //@ts-ignore
            style={{
                //@ts-ignore
                display: 'flex', minHeight: !isPreview ? "80px" : "30px", flexDirection: mode,
                // border: currentBorder + "px solid " + borderColor,
                // position: 'relative',
                // top: '-'+currentBorder+'px',
                // left: '-'+currentBorder+'px',
                borderRadius: 13,
                textAlign: "center",
                fontSize: useTheme('nodeFontSize'),
                boxShadow: isThemePreview ? "none" : generateBoxShadow(container ? 0 : isHover ? 10 : !isPreview && node?.selected ? 10 : 3),
                cursor: isThemePreview ? 'default' : undefined,
                ...style,
            }}
            className={draggable ? '' : 'nodrag'}
        >
            {(title || headerContent) && !isThemePreview ? <div ref={boxRef} style={{ display: 'flex', backgroundColor: color, borderRadius: isPreview ? '8px' : innerBorderRadius, borderBottom: mode == 'column' && !isPreview ? borderWidth + ' solid ' + borderColor : '0px', paddingBottom: '10px', justifyContent: 'center' }}>
                {icon && flowDirection == "LEFT" ? <div style={{ display: 'flex', right: '15px', position: 'absolute', top: '8px' }}>{React.createElement(icon, { size: id ? titleSize : '18px', color: hColor })}</div> : null}
                {title ? <Text style={{ fontSize: id ? titleSize : '18px', padding: '0px 10px 0px 10px', color: tColor, flex: 1, textAlign: 'center', alignSelf: 'center', position: 'relative', top: '4px', fontFamily: 'Jost-Medium', maxWidth: '15ch', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{title}</Text> : null}
                {icon && flowDirection == "RIGHT" ? <div style={{ display: 'flex', left: '10px', position: 'absolute', top: '8px' }}>{React.createElement(icon, { size: id ? titleSize : '18px', color: hColor })}</div> : null}
                {headerContent}
            </div> : null}
            {!isPreview
                ? <div style={{ borderRadius: '0px 0px ' + innerRadius + innerRadius, backgroundColor: container ? "transparent" : themeBackgroundColor, flex: 1, paddingTop: '0.5ch', paddingBottom: '0.5ch', ...contentStyle }}>
                    {children}
                </div>
                : <></>
            }
        </div>
    );
}

export interface NodePortProps {
    type: "input" | "output" | "target" | "source",
    id: string,
    style?: any,
    handleId?: string,
    label?: string,
    isConnected?: boolean,
    nodeId?: string,
    position?: any,
    allowedTypes?: string[]
}

//{`${id}${PORT_TYPES.flow}${handleId ?? type}`}
export const NodePort = ({ id, type, style, label, isConnected = false, nodeId, position = Position.Right, allowedTypes }: NodePortProps) => {
    const textRef: any = React.useRef()
    const handleRef: any = React.useRef()
    const useFlowsStore = useContext(FlowStoreContext)
    const setMenu = useFlowsStore(state => state.setMenu)
    const instanceId = useFlowsStore(state => state.flowInstance)
    const labelWidth = 160
    const ml = position == Position.Right ? `-${labelWidth}px` : '25px'

    const edges = useEdges();
    const connected = isHandleConnected(edges, id)

    const portSize = useTheme('portSize')
    const plusColor = useTheme('plusColor')
    const borderColor = useTheme('nodeBorderColor')
    const borderWidth = useTheme('nodeBorderWidth')
    const nodeFontSize = useTheme('nodeFontSize')
    const editingLayout = useFlowsStore(state => state.editingLayout)
    const isThemePreview = editingLayout == 'node'
    const onOpenMenu = () => {
        setMenu("open", [handleRef?.current.getBoundingClientRect().right + 200, handleRef?.current.getBoundingClientRect().top - 30], {
            targetHandle: id,
            target: nodeId
        })
    }
    let backgroundColor = allowedTypes ? allowedTypes.includes("block") ? useTheme('blockPort') : useTheme('flowPort') : null
    if (allowedTypes.length == 1 && allowedTypes.includes("data")) backgroundColor = useTheme('dataPort')

    React.useEffect(() => {
        write(instanceId, id, allowedTypes)
    }, [allowedTypes])

    const marginRight = Math.floor(((portSize / 3.5) * -1))
    return (
        <>
            <Handle
                ref={handleRef}
                tabIndex={connected ? -1 : 0}
                title={DEVMODE ? id : undefined}
                onClick={() => onOpenMenu()}
                onKeyDown={(e) => e.code == 'Enter' ? onOpenMenu() : null}
                type={"target"}
                position={position}
                style={{
                    backgroundColor: backgroundColor,
                    display: isThemePreview ? 'none' : 'flex', flexDirection: 'row',
                    alignItems: 'center',
                    border: borderWidth + " solid " + borderColor, width: portSize + "px", height: portSize + "px", marginLeft: '',
                    marginRight: marginRight + 'px', cursor: 'pointer', ...style
                }}
                id={id}
                isConnectable={!connected}
                isValidConnection={(c) => {
                    const sourceId = c.source.split('_')[0]
                    const flowNode = NodeTypes[sourceId]
                    if (flowNode) {
                        const flowNodeType = flowNode.type ?? flowNode
                        const dataOutput = flowNodeType && flowNodeType.dataOutput ? flowNodeType.dataOutput : 'data'
                        if (allowedTypes.indexOf(dataOutput) == -1) return false
                    }
                    const sourceConnected = isHandleConnected(edges, c.sourceHandle)
                    return !sourceConnected
                }}
            >
                {label ? <div style={{ display: 'flex', width: `${labelWidth}px`, marginLeft: ml, zIndex: -1, justifyContent: 'flex-end' }}>
                    <Text ref={textRef} style={{ marginRight: '5px', textAlign: position == Position.Right ? 'right' : 'left' }}>{label}</Text>
                </div> : null}
                {
                    !connected ?
                        <div style={{
                            width: portSize + "px",
                            height: portSize + "px",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Plus color={plusColor} size={10} strokeWidth={5} />
                        </div>
                        : null
                }
            </Handle>
        </>
    )
}

export const isHandleConnected = (edges, handleId) => edges.find(e => (e.targetHandle == handleId || e.sourceHandle == handleId))
export const isNodeConnected = (edges, nodeId) => edges.find(e => (e.target == nodeId || e.source == nodeId))

export default memo(Node)