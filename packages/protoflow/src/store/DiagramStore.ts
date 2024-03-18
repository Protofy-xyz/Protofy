import { Dispatch, SetStateAction } from 'react';
import {
    useReactFlow, Node, Edge, useNodesState,
    useEdgesState, EdgeChange, NodeChange,
    addEdge as addReactFlowEdge, Connection,
    useEdges
} from 'reactflow';

type OnChange<ChangesType> = (changes: ChangesType[]) => void;

export const useProtoflow = () => {
    const {
        setNodes: reactFlowSetNodes,
        setEdges: reactFlowSetEdges,
        project,
        setViewport,
        getNodes,
        getViewport,
        setCenter,
        getEdges,
        deleteElements,
        fitView
    } = useReactFlow()

    const setNodes: (payload: Node<any>[] | ((nodes: Node<any>[]) => Node<any>[])) => void = (payload) => {
        reactFlowSetNodes(payload);
    };
    const setEdges: (payload: Edge<any>[] | ((edges: Edge<any>[]) => Edge<any>[])) => void = (payload) => {
        reactFlowSetEdges(payload)
    }

    return {
        setNodes,
        project,
        setViewport,
        getNodes,
        getViewport,
        setCenter,
        setEdges,
        getEdges,
        deleteElements,
        fitView
    }
};

export const useProtoNodesState = (initialItems: Node<any, string>[]): [Node<any, string>[], Dispatch<SetStateAction<Node<any, string>[]>>, OnChange<NodeChange>] => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialItems.map(i => ({ ...i, data: { ...i.data, preview: 'node' } })))

    return [nodes, setNodes, onNodesChange]
}

export const useProtoEdgesState = (initialItems: Edge<any>[]): [Edge<any>[], Dispatch<SetStateAction<Edge<any>[]>>, OnChange<EdgeChange>] => {
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialItems.map(i => ({ ...i, data: { ...i.data, preview: 'node' } })))

    return [edges, setEdges, onEdgesChange]
}

export const useProtoEdges = (): Edge<unknown>[] => {
    return useEdges()
}

export const addEdge = (edgeParams: Edge | Connection, edges: Edge[]) => {
    return addReactFlowEdge(edgeParams, edges)
}