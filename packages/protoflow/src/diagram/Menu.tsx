import React, { useState, useRef, useLayoutEffect, useContext, useEffect, useCallback } from 'react';
import { Panel } from 'reactflow';
import nodes from '../nodes'
import { FlowStoreContext } from "../store/FlowsStore";
import { generateId } from '../lib/IdGenerator';
import { POKA_HANDLE_TYPES, PORT_TYPES, createNode } from '../lib/Node';
import { withTopics } from "react-topics";
import { POKAYOKE_ENABLED } from '../toggles';
import Text from './NodeText';
import useTheme from './Theme';
import { splitOpenerEdge } from '../lib/Edge';
import { Search } from 'lucide-react'
import { useProtoflow } from '../store/DiagramStore';

const pokayokeEnabled = POKAYOKE_ENABLED ?? false

export default withTopics(({ enabledNodes = ['*'], hideBaseComponents, customComponents = [], style = {}, diagramNodes, setNodes, setNodeData, nodeData, edges, setEdges, takeSnapshot = () => null, reactFlowWrapper = null, topics, onAddNode = (node: any, newEdge: any, initialData: any) => null, onEditDiagram = (nodes, edges, focus) => { } }) => {
    const panelRef = useRef()
    const inputRef = useRef()
    const scrollRef: any = useRef()
    const inputHeight = 50
    const [searchValue, setSearchValue] = useState('')
    const [selectedNode, setSelectedNode] = useState(0)
    const useFlowsStore = useContext(FlowStoreContext)
    const menuState = useFlowsStore(state => state.menuState)
    const menuPosition = useFlowsStore(state => state.menuPosition)
    const menuOpener = useFlowsStore(state => state.menuOpener)
    const setMenu = useFlowsStore(state => state.setMenu)
    const { project, setViewport, getViewport, setCenter } = useProtoflow();
    const { publish } = topics;

    const menuWidth = 259
    const menuHeight = 500
    const menuMargin = 100

    const getMenuTop = () => {
        var defaultTop = (menuPosition[1] - 30)
        if (defaultTop < 70) {
            return 70
        } else if (defaultTop + menuHeight + menuMargin < reactFlowWrapper?.current.offsetHeight) {
            return defaultTop
        } else {
            return reactFlowWrapper?.current.offsetHeight - menuHeight - menuMargin
        }
    }
    const getMenuLeft = () => {
        var defaultLeft = (menuPosition[0] - 110)
        if (!reactFlowWrapper?.current) return 100
        if (defaultLeft < 100 || (reactFlowWrapper?.current.offsetWidth - menuWidth - menuMargin) < 100) {
            return 100
        } else if (defaultLeft + menuWidth + menuMargin < reactFlowWrapper?.current.offsetWidth) {
            return defaultLeft
        } else {
            return reactFlowWrapper?.current.offsetWidth - menuWidth - menuMargin
        }
    }
    const _nodes: any = Object.fromEntries(
        Object.entries(nodes).filter(([key, value]) => enabledNodes.includes(key) || enabledNodes.includes('*'))
    );

    const _customComponents = customComponents.filter((c) => enabledNodes.includes(c.type) || enabledNodes.includes('*'))

    const handleTypeOpener = menuOpener.targetHandle ? menuOpener.targetHandle.replace(menuOpener.target, '').slice(1) : null
    var pokaNodesList: any = Object.keys(_nodes)
    var pokaCustomNodesList: any = _customComponents
    // WIP FILTER NON CONECTABLE NODES (POKAYOKE)
    var hasPokaResults = false
    if (pokayokeEnabled && handleTypeOpener) {
        var handleStart = Object.keys(POKA_HANDLE_TYPES).find(p => handleTypeOpener.startsWith(p))
        if (handleStart == 'param' && menuOpener.targetHandle?.endsWith('-key')) {
            handleStart = 'key'
        }
        if (handleStart && POKA_HANDLE_TYPES[handleStart].length) {
            pokaNodesList = Object.keys(_nodes).filter(n => POKA_HANDLE_TYPES[handleStart].includes(n))
            pokaCustomNodesList = _customComponents.filter(c => POKA_HANDLE_TYPES[handleStart].includes(c.type))
            hasPokaResults = true
        }
    }
    const nodeList = searchValue ? Object.keys(_nodes).filter(n => {
        var node = _nodes[n].type ?? _nodes[n]
        const allKeyWords = [...node.keyWords, node.name]
        //@ts-ignore
        return allKeyWords?.map(k => k.toLowerCase()).join().includes(searchValue.toLowerCase())
    }) : pokaNodesList
    const customNodeList = searchValue
        ? _customComponents.filter(customN => customN.id.toLowerCase().replace(/\s+/g, '').includes(searchValue.toLowerCase().replace(/\s+/g, '')))
        : pokaCustomNodesList

    const extraStyle = menuState != 'open' ? { top: '-5000px' } : { top: getMenuTop() + 'px', left: getMenuLeft() + 'px' }

    const addElement = async (type, customNode?) => {
        takeSnapshot()
        setSearchValue('')

        const id = type + PORT_TYPES.flow + generateId()
        const pos = project({ x: getMenuLeft(), y: menuPosition[1] })
        var newNode = createNode([pos.x, pos.y - 70], type, id, {}, true, {}, {})
        var newEdges = []
        var initialData = {}
        var edgesToDelete = []

        if (customNode) {
            initialData = customNode.getInitialData()
            setNodeData(id, initialData)
        }
        if (menuOpener.type == 'edge') {
            const node = _nodes[type].type ?? _nodes[type]
            const defaultHandle = node.defaultHandle
            newEdges.push(...splitOpenerEdge(menuOpener, id, defaultHandle))
            edgesToDelete.push(menuOpener.edgeId)
        } else {
            const target = menuOpener.target

            const newEdge = {
                animated: false,
                id: generateId(),
                source: id,
                sourceHandle: id + '-output',
                target: target,
                targetHandle: menuOpener.targetHandle,
                type: 'custom'
            }
            newEdges.push(newEdge)
            if (!nodeData[target].hasOwnProperty(handleTypeOpener)) {
                setNodeData(target, { [handleTypeOpener]: undefined })
            }
            onAddNode(newNode[0], newEdge, initialData) // createNode returns array, get frist position
        }

        const finalEdges = edges.filter((e) => !edgesToDelete.includes(e.id)).concat(newEdges)
        const finalNodes = diagramNodes.concat(newNode);
        setMenu('closed')
        const focusElement = (newNodes, diagramRef) => {
            if (!diagramRef) return
            const diagramRect = diagramRef.getBoundingClientRect();
            const viewport = getViewport()
            //console.log('infocus', scaledContainerWidth, scaledContainerHeight)
            const myNode = newNodes.find(n => n.id == newNode[0].id)
            const elem = document.getElementById(id)
            const posX = -myNode.position.x //+ (diagramRect.width / 2)
            const posY = -myNode.position.y //+ (diagramRect.height / 2)

            if (!elem) return
            const firstInput = elem.querySelector('input:first-of-type')
            if (firstInput) {
                //@ts-ignore
                firstInput.focus()
                handleTransform(posX, posY, viewport.zoom)
            }
            const firstButton = elem.querySelector("div > [role='button']:first-of-type")
            if (firstButton) {
                //@ts-ignore
                firstButton.focus()
                handleTransform(posX, posY, viewport.zoom)
            }
        }
        onEditDiagram(finalNodes, finalEdges, focusElement)
    }
    const handleTransform = useCallback((posX, posY, zoom) => {
        //setViewport({ x: posX, y: posY, zoom: zoom}, { duration: 500 });
    }, [setViewport]);

    const onSubmit = () => {
        if (selectedNode + 1 > customNodeList.length && nodeList.length) {
            addElement(nodeList[selectedNode - customNodeList.length])
        } else if (customNodeList.length) {
            addElement(customNodeList[selectedNode].type, customNodeList[selectedNode])
        }
    }
    const onKeyDown = (e) => {
        const heightToScroll = 44
        if (e.key == "Enter") {
            onSubmit()
        } else if (e.key == "ArrowDown" && selectedNode < (customNodeList.length + nodeList.length) - 1) {
            setSelectedNode(selectedNode + 1)
            //@ts-ignore
            scrollRef.current.scrollBy({ top: heightToScroll, behavior: 'smooth' });
        } else if (e.key == "ArrowUp" && selectedNode > 0) {
            setSelectedNode(selectedNode - 1)
            //@ts-ignore
            scrollRef.current.scrollBy({ top: -heightToScroll, behavior: 'smooth' });
        } else {
            setSelectedNode(0)
        }
    }
    const SelectedBorder = (props) => {
        return (
            <div style={{
                display: 'flex', border: props.isSelected ? `${useTheme("borderWidth")}px solid black` : '0px solid transparent',
                borderRadius: useTheme("borderWidthSelected") * 2, alignItems: 'stretch', backgroundColor: 'rgba(0, 0, 0, 0)',
                boxSizing: 'border-box', flexBasis: 'auto', flexDirection: 'column', flexShrink: '0',
                listStyle: 'none', margin: '0px', minHeight: '0px', minWidth: '0px',
                padding: '0px', position: 'relative', textDecoration: 'none', zIndex: '0'
            }}>
                {props.children}
            </div>
        )
    }

    useEffect(() => {
        if (menuState != 'closed') {
            try {
                //@ts-ignore
                inputRef?.current.focus()
            } catch (e) {
                console.error('error focusing element. ', e)
            }
        }
        publish("menuState", { state: menuState })
    }, [menuState])

    const textColor = useTheme("textColor");

    return (
        <Panel position='top-left'>
            <div
                onClick={() => setMenu('closed')}
                style={{ display: menuState == 'closed' ? 'none' : 'flex', height: '100vh', width: '100vw', position: 'absolute' }}>
            </div>
            <div style={{ display: 'flex', flexDirection: "column", height: menuHeight, margin: '0px', position: 'absolute', border: '1px solid grey', borderRadius: '10px', ...extraStyle }}>
                <div ref={panelRef} style={{ flexGrow: 1, width: menuWidth, backgroundColor: useTheme("nodeBackgroundColor"), borderRadius: '10px', paddingBottom: '20px', padding: '10px', border: `${useTheme('borderWidth')}px solid ${useTheme('borderColor')}` }}>
                    <div style={{ height: inputHeight }}>
                        <input
                            ref={inputRef}
                            style={{
                                fontFamily: 'Jost-Regular',
                                padding: '8px',
                                border: useTheme('inputBorder'),
                                display: 'flex',
                                flex: 1,
                                width: '100%',
                                boxSizing: 'border-box',
                                fontSize: '14px',
                                backgroundColor: useTheme("highlightInputBackgroundColor"),
                                borderRadius: '6px',
                                borderWidth: '0px',
                                outline: 'none',
                                paddingLeft: '32px',
                                color: textColor
                            }}
                            value={searchValue}
                            onKeyDown={onKeyDown}
                            onChange={t => setSearchValue(t.target.value)}
                            placeholder="search nodel"
                        />
                        <Search color='#57534e' size={20} style={{ marginRight: '-5px', marginLeft: '8px', position: 'absolute', top: 18 }} />
                    </div>
                    <div ref={scrollRef} className={".list-protoflow"} style={{ height: `calc(${menuHeight}px - ${inputHeight}px - 22px)`, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', paddingRight: scrollRef?.current?.scrollHeight > scrollRef?.current?.clientHeight ? '10px' : '0px' }}>
                        {
                            !hideBaseComponents && customNodeList.length
                                ? <Text style={{ fontSize: '16px', marginBottom: '10px', fontFamily: 'Jost-Medium', marginLeft: '10px' }}>Custom {hasPokaResults && !searchValue.length ? '(Suggestions)' : ''}</Text>
                                : null
                        }
                        {_customComponents.map((customNode, index) => {
                            const realIndex = customNodeList.map(n => n.id.toLowerCase().replace(/\s+/g, '')).indexOf(customNode.id.toLowerCase().replace(/\s+/g, ''))
                            const isSelected = realIndex == selectedNode
                            return !customNode.hidden ? (
                                <div
                                    key={index}
                                    onClick={() => addElement(customNode.type, customNode)}
                                    //@ts-ignore
                                    style={{ display: !customNodeList.map(n => n.id.toLowerCase().replace(/\s+/g, '')).includes(customNode.id.toLowerCase().replace(/\s+/g, '')) ? 'none' : 'flex', marginBottom: '10px' }}>
                                    <SelectedBorder isSelected={isSelected}>
                                        {customNode.getComponent({ type: customNode.type }, {}, null, customNode)}
                                        {/*React.createElement(mask?.getComponent, { { type: customNode.type }, {}, null, customNode}) */}
                                    </SelectedBorder>
                                </div>) : null
                        })}
                        {!hideBaseComponents && customNodeList.length ? <div style={{ margin: '10px 0px 10px 0px' }}></div> : null}
                        {!hideBaseComponents && nodeList.length
                            ? <>
                                <Text style={{ fontSize: '16px', marginBottom: '10px', fontFamily: 'Jost-Medium', marginLeft: '10px' }}>JavaScript {hasPokaResults && !searchValue.length ? '(Suggestions)' : ''}</Text>
                                {nodeList.map((nodeName, index) => (
                                    <div onClick={() => addElement(nodeName)} key={index} style={{ marginBottom: '10px' }}>
                                        <SelectedBorder isSelected={customNodeList.length + index == selectedNode}>
                                            {React.createElement(_nodes[nodeName], { type: nodeName })}
                                        </SelectedBorder>
                                    </div>
                                ))}
                            </> : null}
                    </div>
                </div>
            </div>
        </Panel>
    );
});