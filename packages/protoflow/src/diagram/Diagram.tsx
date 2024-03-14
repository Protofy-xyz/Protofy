import React, { useCallback, useRef, useState, useContext, useEffect, cloneElement } from 'react';
import ReactFlow, {
    MiniMap,
    Background,
    ReactFlowProvider,
    OnNodesDelete,
    NodeDragHandler,
    OnEdgesDelete,
    SelectionDragHandler
} from 'reactflow';
import useUndoRedo from '../hooks/useUndoRedo';
import useKeypress from 'react-use-keypress';
import { FlowStoreContext } from "../store/FlowsStore"
import SelectionListener from './SelectionListener';
import ZoomDetector from '../ZoomDetector';
import { withTopics } from "react-topics";
import { useProtoflow } from '../store/DiagramStore';

type DiagramParams = {
    componentsMenu?: any,
    disableMiniMap?: boolean,
    disableDots?: boolean,
    zoomOnDoubleClick?: boolean,
    edgeTypes?: any,
    nodeTypes?: any,
    edges?: any[],
    nodes?: any[],
    onInit?: any,
    onNodesChange?: any,
    onEdgesChange?: any,
    onConnect?: any,
    onDropCb?: any,
    onDragOver?: any,
    onSelectionChange?: any,
    style?: any,
    onNodeClick?: any,
    children?: any,
    topics?: any
    onNodesDelete?: any,
    themeMode?: "light" | "dark",
    theme?: any,
    defaultViewPort?: { x: number, y: number, zoom: number },
    onViewPortChange?: any,
    nodePreview?: 'preview' | 'flow-preview' | 'flow',
    defaultSelected?: Function
}

const Diagram = React.forwardRef(({
    componentsMenu = <></>,
    disableMiniMap = false,
    disableDots = false,
    zoomOnDoubleClick = true,
    edgeTypes = [],
    nodeTypes = [],
    edges = [],
    nodes = [],
    onInit = (reactFlowInstance: any) => { },
    onNodesChange = () => { },
    onEdgesChange = () => { },
    onConnect = () => { },
    style = {},
    onSelectionChange = () => { },
    onNodeClick = () => { },
    onNodesDelete,
    children = null,
    topics,
    themeMode = "light",
    theme = {},
    defaultViewPort = { x: 100, y: window.innerHeight / 4, zoom: 0.8 },
    onViewPortChange = () => { },
    nodePreview = 'flow',
    defaultSelected = () => undefined
}: DiagramParams, ref) => {
    const reactFlowWrapper = useRef<HTMLElement | null>(null);
    const isDiagramVisible = reactFlowWrapper.current?.getBoundingClientRect()?.height > 0
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData)
    const setThemeMode = useFlowsStore(state => state.setTemeMode)
    const [internalData, setInternalData] = useState([])
    const { project, setViewport, getNodes, getViewport, setCenter, setEdges, getEdges, setNodes } = useProtoflow()

    const { undo, redo, takeSnapshot, clearNodes } = useUndoRedo();
    const connectingNode = useRef<{
        handleType?: string;
        nodeId?: string;
        handleId?: string;
    } | null>(null);
    const setMenu = useFlowsStore(state => state.setMenu)
    const setNodeData = useFlowsStore(state => state.setNodeData)
    const [pastZoomNodes, setPastZoomNodes] = useState([])
    const { data, publish } = topics;

    const isViewModePreview = nodePreview === 'preview'
    const preview = isViewModePreview ? 'node' : 'default'

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onNodeDragStart: NodeDragHandler = useCallback(() => {
        // 👇 make dragging a node undoable
        takeSnapshot();
        // 👉 you can place your event handlers here
    }, [takeSnapshot]);

    const onSelectionDragStart: SelectionDragHandler = useCallback(() => {
        // 👇 make dragging a selection undoable
        takeSnapshot();
    }, [takeSnapshot]);

    const onDeleteNode: OnNodesDelete = useCallback((deletedNodes) => {
        onNodesDelete(deletedNodes)
        // 👇 make deleting nodes undoable
        takeSnapshot();
    }, [takeSnapshot, publish]);

    const filterDataFromParent = (deletedEdges) => {
        deletedEdges.forEach(edge => {
            const parentId = edge.target
            const parentData = nodeData[parentId]
            const deletedKey = edge.targetHandle.replace(parentId, '').slice(1)
            let parentType = nodeTypes[parentId.split('_')[0]]
            if (parentType.type) parentType = parentType.type

            if (deletedKey) {
                if (parentType.onDeleteConnection) {
                    setNodeData(parentId, parentType.onDeleteConnection(parentData, deletedKey))
                } else {
                    setNodeData(parentId, { ...parentData, [deletedKey]: '' })
                }
            }
        })
    }
    const onEdgesDelete: OnEdgesDelete = useCallback((deletedEdges) => {
        filterDataFromParent(deletedEdges)
        // 👇 make deleting edges undoable
        takeSnapshot();
    }, [takeSnapshot, nodeData]);

    const connect = (params) => {
        takeSnapshot();
        onConnect(params)
    }

    const onConnectStart = useCallback((_, data) => {
        connectingNode.current = data;
    }, []);

    const onConnectEnd = useCallback(
        (event) => {
            const targetIsPane = event.target.classList.contains('react-flow__pane');
            if (targetIsPane && connectingNode.current?.handleType == 'target') {
                // we need to remove the wrapper bounds, in order to get the correct position
                setMenu('open', [event.clientX, event.clientY], {
                    target: connectingNode.current.nodeId,
                    targetHandle: connectingNode.current.handleId
                })
            }
        },
        [project]
    );

    const showAll = () => {
        setEdges(getEdges().map(e => ({ ...e, hidden: false, data: { ...e.data, preview } })))
        setNodes(getNodes().map(n => ({ ...n, hidden: false, data: { ...n.data, preview } })))
    }

    const findConnectedNodes = (nodeId) => { // get node ids connected to specific node
        let result = [nodeId];
        const elems = getEdges().filter(e => e.target == nodeId)
        if (elems.length) {
            elems.forEach(e => {
                result = result.concat(...findConnectedNodes(e.source))
            })
        }
        return result;
    }


    const showSelectedContext = (selectedNodeId) => {
        const matchNodeIds = findConnectedNodes(selectedNodeId)
        let newNodes = getNodes().map(n => {
            return { ...n, hidden: !matchNodeIds.includes(n.id), data: { ...n.data, preview } }
        })
        let newEdges = getEdges().map(e => {
            return { ...e, hidden: !matchNodeIds.includes(e.target), data: { ...e.data, preview } }
        })
        setEdges(newEdges)
        setNodes(newNodes)
    }

    const hideUnselected = (selectedNodeId) => {
        if (selectedNodeId) {
            setEdges(getEdges().map(e => ({ ...e, hidden: true, data: { ...e.data, preview } })))
            setNodes(getNodes().map(n => ({ ...n, hidden: n.id != selectedNodeId, data: { ...n.data, preview } })))
        }
    }
    const zoomToNode = useCallback((selectedNodeId) => {
        setTimeout(() => {
            var selectedNodeIndex
            const selectedNode = getNodes().find((n, i) => {
                selectedNodeIndex = i
                return n.id == selectedNodeId
            })
            if (!selectedNode) return
            const flowsWidth = reactFlowWrapper.current?.offsetWidth
            if (!flowsWidth) return // skip if diagram is not visible
            const flowsHeight = reactFlowWrapper.current?.offsetHeight
            const marginTop = isViewModePreview ? 10 : 50
            const posX = selectedNode.position.x + selectedNode.width / 2
            const posY = selectedNode.position.y + (flowsHeight / 2) - marginTop
    
            setNodes(nds => {
                nds[selectedNodeIndex] = {
                    ...nds[selectedNodeIndex],
                    data: {
                        ...nds[selectedNodeIndex]['data'],
                        flowsHeight: flowsHeight
                    }
                }
                return nds
            })
            setCenter(posX, posY, { zoom: 1, duration: isViewModePreview ? 1 : 500 })
        }, 20)
    }, [setCenter, nodePreview, nodes]);

    useKeypress(['z', 'Z'], async (event) => {
        if (!isDiagramVisible) return
        if ((event.key == "z" || event.key == "Z") && (event.ctrlKey || event.metaKey) && event.shiftKey) {
            event.preventDefault();
            await clearNodes('redo')
            return redo()
        } else if ((event.key == "z" || event.key == "Z") && (event.ctrlKey || event.metaKey)) { // Undone
            event.preventDefault();
            await clearNodes('undo')
            return undo()
        }
    });

    useEffect(() => {
        setThemeMode(themeMode, theme)
    }, [themeMode, theme])

    useEffect(() => {
        internalData.push(nodeData)
        setInternalData(internalData)
        if (reactFlowWrapper.current) {
            reactFlowWrapper.current['nodeData'] = nodeData
        }
    }, [nodeData])

    useEffect(() => {
        if (!document.activeElement) return
        const userWriting = document.activeElement.id?.includes('input')
        const userSelecting = document.activeElement.id?.includes('select')
        const userDeleting = document.activeElement.id?.includes('delete-button')
        // Get the node data before start writting.
        const pastNodeData = internalData[internalData.length - 2]
        if (!pastNodeData) return
        if ((userSelecting || userWriting || userDeleting) && Object.keys(pastNodeData).length) {
            takeSnapshot(pastNodeData);
        }
    }, [document.activeElement])

    useEffect(() => {
        const nodeToZoomId = data['zoomToNode']?.id
        if (nodeToZoomId) {
            if (pastZoomNodes[0] == nodeToZoomId) return
            pastZoomNodes[0] = nodeToZoomId
            setPastZoomNodes([...pastZoomNodes])
            zoomToNode(nodeToZoomId)
            if (isViewModePreview) hideUnselected(nodeToZoomId)
        }
    }, [data['zoomToNode']])

    useEffect(() => {
        // If you select a node when the diagram is not visible, it is necessary to zoom in when it is visible again.
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && reactFlowWrapper.current['open'] == false && !pastZoomNodes[0]) {
                    pastZoomNodes[0] = defaultSelected(reactFlowWrapper.current['nodeData'])
                    zoomToNode(pastZoomNodes[0])
                }
                if (reactFlowWrapper.current) {
                    reactFlowWrapper.current['open'] = entry.isIntersecting
                }
            },
            {
                threshold: 0.5 // part of diagram to be visible
            }
        );
        if (reactFlowWrapper.current) {
            observer.observe(reactFlowWrapper.current);
        }
        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        switch (nodePreview) {
            case 'preview':
                hideUnselected(pastZoomNodes[0])
                break;
            case 'flow-preview':
                showSelectedContext(pastZoomNodes[0])
                break;
            case 'flow':
                showAll()
                break;
            default:
                console.error('Unauthorized value for nodePreview: ', nodePreview)
        }
        zoomToNode(pastZoomNodes[0])
    }, [nodePreview, pastZoomNodes[0]])

    const proOptions = { hideAttribution: true };

    return (<div style={{ width: '100%', height: "100%" }}>
        <SelectionListener onSelectionChange={onSelectionChange} />
        <div style={{ height: '100%' }} ref={reactFlowWrapper as any}>
            <ReactFlow
                onMoveEnd={(e) => onViewPortChange(getViewport())}
                defaultViewport={defaultViewPort}
                proOptions={proOptions}
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                zoomOnDoubleClick={zoomOnDoubleClick}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onConnect={connect}
                onNodeDragStart={onNodeDragStart}
                onSelectionDragStart={onSelectionDragStart}
                onNodesDelete={onDeleteNode}
                onEdgesDelete={onEdgesDelete}
                onNodeClick={onNodeClick}
                style={{ cursor: "pointer", ...style }}
                onDragOver={onDragOver}
                edgeTypes={edgeTypes}
                zoomOnScroll={nodePreview !== 'preview'}
                panOnDrag={nodePreview !== 'preview'}
                minZoom={0.3}
                maxZoom={2}
                onInit={(reactFlowInstance: any) => {
                    onInit(reactFlowInstance)
                }}
            >
                {!disableMiniMap ? <MiniMap zoomable pannable /> : null}
                {!disableDots ? <Background /> : null}
                {cloneElement(componentsMenu, { takeSnapshot: takeSnapshot, reactFlowWrapper: reactFlowWrapper })}
                {children}
                <ZoomDetector zoom={defaultViewPort.zoom} />
            </ReactFlow>
        </div>
    </div>)
})

const DiagramComponent = (props) => <ReactFlowProvider>
    <Diagram {...props} />
</ReactFlowProvider>

export default React.memo(withTopics(DiagramComponent, { topics: ['zoomToNode', 'flow/editor'] }))

