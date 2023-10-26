import React, { useCallback, useRef, useState, useContext, useEffect, cloneElement } from 'react';
import ReactFlow, {
    MiniMap,
    Background,
    Panel,
    ReactFlowProvider,
    OnNodesDelete,
    NodeDragHandler,
    OnEdgesDelete,
    SelectionDragHandler,
    useReactFlow
} from 'reactflow';
import useUndoRedo from '../hooks/useUndoRedo';
import useKeypress from 'react-use-keypress';
import { FlowStoreContext } from "../store/FlowsStore"
import SelectionListener from './SelectionListener';
import ZoomDetector from '../ZoomDetector';
import { withTopics } from "react-topics";

type DiagramParams = {
    componentsMenu?: any,
    disableMiniMap?: boolean,
    disableDots?: boolean,
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
    onViewPortChange?: any
}

const Diagram = React.forwardRef(({
    componentsMenu = <></>,
    disableMiniMap = false,
    disableDots = false,
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
    onViewPortChange = () => { }
}: DiagramParams, ref) => {
    const reactFlowWrapper = useRef<HTMLElement | null>(null);
    const isDiagramVisible = reactFlowWrapper.current?.getBoundingClientRect()?.height > 0
    const useFlowsStore = useContext(FlowStoreContext)
    const nodeData = useFlowsStore(state => state.nodeData)
    const setThemeMode = useFlowsStore(state => state.setTemeMode)
    const [internalData, setInternalData] = useState([])
    const { project, setViewport, getNodes, getViewport, setCenter } = useReactFlow();
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
            console.log('parent type: ', parentType)

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

    const zoomToNode = useCallback((selectedNodeId) => {
        const selectedNode = getNodes().find(n => n.id == selectedNodeId)
        if (!selectedNode) return
        const flowsWidth = reactFlowWrapper.current.offsetWidth
        if (!flowsWidth) return // skip if diagram is not visible
        const posX = selectedNode.position.x + selectedNode.width / 2
        const posY = selectedNode.position.y + selectedNode.height / 2
        setTimeout(() => setCenter(posX, posY, { zoom: 0.6, duration: 800 }), 50);
    }, [setCenter]);

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
        if (data['zoomToNode'] && nodeToZoomId) {
            if (pastZoomNodes[0] == data['zoomToNode'].id) return
            pastZoomNodes[0] = nodeToZoomId
            setPastZoomNodes(pastZoomNodes)
            zoomToNode(nodeToZoomId)
        }
    }, [data['zoomToNode']])

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
                style={{ cursor: "pointer", backgroundColor: 'white', ...style }}
                onDragOver={onDragOver}
                edgeTypes={edgeTypes}
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

