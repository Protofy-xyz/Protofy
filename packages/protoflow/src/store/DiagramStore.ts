import { useReactFlow, Node, Edge } from 'reactflow';

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