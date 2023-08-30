import React, { useState, useMemo, useCallback } from 'react'
import { memo } from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import systemTheme from "baseapp/core/themes/protofyTheme";
import {Diagram} from '../flowslib';
import {CustomEdge} from '../flowslib';
import { NodeTypes } from '../flowslib';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Panel,
    ReactFlowProvider
} from 'reactflow';
import { createNode } from '../flowslib';

const ProjectScreen = ({isActive}) => {
    //  const { error, data } = useFetch('/api/v1/flows/cloudapi')
    const [ready, setReady] = useState(true)
    const nodeTypes = useMemo(() => (NodeTypes), []);
    const [nodes, setNodes, onNodesChange] = useNodesState([createNode([0, 0], 'Start', 'start', {}, false)]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [nodeData, _setNodeData] = useState({})
    var customComponents = []
    const edgeTypes = useMemo(() => {
        return { custom: CustomEdge }
    }, []);

    const setNodeData = (id, data) => {
        _setNodeData({
            ...nodeData,
            [id]: data
        })
    }

    const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, type: 'custom', animated: !isPullEdge(params.sourceHandle, params.targetHandle) }, eds)), [setEdges]);
    return (
        <NativeBaseProvider theme={extendTheme(systemTheme)}>
            <div style={{ width: '100vw', height: "100vh" }}>
                {ready ? <Diagram
                    disableDots={!isActive}
                    setNodes={setNodes}
                    setNodeData={setNodeData}
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    style={{ backgroundColor: 'white' }}
                    edgeTypes={edgeTypes}
                    onInit={() => {

                    }}
                    customComponents={customComponents}
                /> : null}
            </div>
        </NativeBaseProvider>
    )
}
export default memo(ProjectScreen);