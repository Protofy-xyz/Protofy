import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import {
    useReactFlow, Node, Edge, useNodesState,
    useEdgesState, EdgeChange, NodeChange,
    addEdge as addReactFlowEdge, Connection,
    useEdges
} from 'reactflow';

type OnChange<ChangesType> = (changes: ChangesType[]) => void;

type DiagramState = {
    nodePreview: string
}

export const DiagramContext = createContext<DiagramState>({
    nodePreview: ''
});

const getExtraData = () => {
    const { nodePreview } = useContext(DiagramContext);

    const isViewModePreview = nodePreview === 'preview'
    const preview = isViewModePreview ? 'node' : 'default'
    return {
        preview
    }
}

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

    const extraData = getExtraData()

    const setNodes: (payload: Node<any>[] | ((nodes: Node<any>[]) => Node<any>[])) => void = (payload) => {
        var wrappedNodes
        if (typeof payload === 'function') {
            wrappedNodes = nds => {
                return payload(nds.map(n => ({ ...n, data: { ...n.data, ...extraData } })))
            }
        } else {
            wrappedNodes = payload.map(n => ({ ...n, data: { ...n.data, ...extraData } }))
        }
        reactFlowSetNodes(wrappedNodes);
    };
    const setEdges: (payload: Edge<any>[] | ((edges: Edge<any>[]) => Edge<any>[])) => void = (payload) => {
        var wrappedEdges
        if (typeof payload === 'function') {
            wrappedEdges = edgs => {
                return payload(edgs.map(e => ({ ...e, data: { ...e.data, ...extraData } })))
            }
        } else {
            wrappedEdges = payload.map(e => ({ ...e, data: { ...e.data, ...extraData } }))
        }
        reactFlowSetEdges(wrappedEdges)
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
    const [nodes, setNodes, onNodesChange] = useNodesState(initialItems.map(i => ({ ...i, data: { ...i.data, ...getExtraData() } })))

    return [nodes, setNodes, onNodesChange]
}

export const useProtoEdgesState = (initialItems: Edge<any>[]): [Edge<any>[], Dispatch<SetStateAction<Edge<any>[]>>, OnChange<EdgeChange>] => {
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialItems.map(i => ({ ...i, data: { ...i.data, ...getExtraData() } })))

    return [edges, setEdges, onEdgesChange]
}

export const useProtoEdges = (): Edge<unknown>[] => {
    return useEdges()
}

export const addEdge = (edgeParams: Edge | Connection, edges: Edge[]) => {
    return addReactFlowEdge(edgeParams, edges)
}