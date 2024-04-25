import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import {
    useReactFlow, Node, Edge, useNodesState,
    useEdgesState, EdgeChange, NodeChange,
    addEdge as addReactFlowEdge, Connection,
    useEdges,
    useNodes
} from 'reactflow';

type OnChange<ChangesType> = (changes: ChangesType[]) => void;

type DiagramState = {
    nodePreview: string,
    flowsHeight: number | undefined
}

export const DiagramContext = createContext<DiagramState>({
    nodePreview: '',
    flowsHeight: undefined
});

const getExtraData = () => {
    const { nodePreview, flowsHeight } = useContext(DiagramContext);

    const isViewModePreview = nodePreview === 'preview'
    const preview = isViewModePreview ? 'node' : 'default'

    return {
        preview,
        flowsHeight: flowsHeight
    }
}

const wrapDiagramItem = (payload, dataToAdd) => { // wrapper for diagram edges and nodes
    var wrappedElements
    if (typeof payload === 'function') {
        wrappedElements = ele => {
            return payload(ele.map(e => ({ ...e, data: { ...e.data, ...dataToAdd } })))
        }
    } else {
        wrappedElements = payload.map(e => ({ ...e, data: { ...e.data, ...dataToAdd } }))
    }
    return wrappedElements
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
        reactFlowSetNodes(wrapDiagramItem(payload, extraData));
    };
    const setEdges: (payload: Edge<any>[] | ((edges: Edge<any>[]) => Edge<any>[])) => void = (payload) => {
        reactFlowSetEdges(wrapDiagramItem(payload, extraData))
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

export const useProtoNodesState = (initialItems: Node<any, string>[], extraData: DiagramState | {} = {}): [Node<any, string>[], Dispatch<SetStateAction<Node<any, string>[]>>, OnChange<NodeChange>] => {

    const [nodes, reactFlowSetNodes, onNodesChange] = useNodesState(wrapDiagramItem(initialItems, extraData))

    const setNodes: Dispatch<SetStateAction<Node<any, string>[]>> = (payload: any) => reactFlowSetNodes(wrapDiagramItem(payload, extraData))

    return [nodes, setNodes, onNodesChange]
}

export const useProtoEdgesState = (initialItems: Edge<any>[], extraData: DiagramState | {} = {}): [Edge<any>[], Dispatch<SetStateAction<Edge<any>[]>>, OnChange<EdgeChange>] => {

    const [edges, reactFlowSetEdges, onEdgesChange] = useEdgesState(wrapDiagramItem(initialItems, extraData))

    const setEdges: Dispatch<SetStateAction<Edge<any>[]>> = (payload: any) => reactFlowSetEdges(wrapDiagramItem(payload, extraData))

    return [edges, setEdges, onEdgesChange]
}

export const useProtoEdges = (): Edge<unknown>[] => {
    const nodes = useNodes()
    const edges = useEdges()

    return edges.filter(e => nodes.find(n => n.id === e.source) && nodes.find(n => n.id === e.target))
}

export const addProtoEdge = (edgeParams: Edge | Connection, edges: Edge[]) => {
    return addReactFlowEdge({ ...edgeParams, type: 'custom', animated: false }, edges)
}