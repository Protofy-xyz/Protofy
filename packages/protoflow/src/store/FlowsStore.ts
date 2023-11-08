import { createContext } from "react"
import create from "zustand";
import produce from "immer";

type FlowsStoreData = {
    menuState: string,
    menuPosition: number[],
    menuOpener: any,
    nodeData: any,
    setNodeData: Function,
    setNodesData: Function,
    setNodesMetaData: Function,
    deletePropNodeData: Function,
    saveStatus: null | 'loading' | 'error',
    setSaveStatus: Function,
    customComponents: any[],
    setCustomComponents: Function
    initialEdges: any,
    setInitialEdges: Function,
    initialNodes: any,
    setInitialNodes: Function,
    appendCustomComponents: Function,
    clearNodesData: Function,
    setMenu: Function,
    dataNotify: any,
    setDataNotify: Function,
    errorData: any,
    setError: Function,
    clearError: Function,
    themeMode: "light" | "dark" | "preview",
    setTemeMode: Function,
    themeOverride: any,
    flowInstance: number,
    currentPath: string
    setCurrentPath: Function
}
export const useFlowsStore = () => {
    return create<FlowsStoreData>((set, get) => ({
        errorData: {},
        nodeData: {},
        customComponents: [],
        initialEdges: [],
        initialNodes: [],
        saveStatus: null,
        menuState: 'closed',
        menuPosition: [0, 0],
        menuOpener: '',
        themeMode: "light",
        themeOverride: {},
        flowInstance: Math.random(),
        currentPath: 'Start',
        dataNotify: () => { },

        setDataNotify: (dataNotify: any) => set(produce((draft: FlowsStoreData) => {
            draft.dataNotify = dataNotify;
        })),

        clearError: () => set(produce((draft: FlowsStoreData) => {
            draft.errorData = {}
        })),

        setError: (id) => set(produce((draft: FlowsStoreData) => {
            draft.errorData = { id: id }
        })),

        setCurrentPath: (path) => set(produce((draft: FlowsStoreData) => {
            draft.currentPath = path
        })),

        setMenu: (menuState: string, menuPosition?: number[], menuOpener?: any) => set(produce((draft: FlowsStoreData) => {
            draft.menuState = menuState;
            draft.menuPosition = menuPosition ? menuPosition : [-5000, -5000];
            draft.menuOpener = menuOpener ? menuOpener : ''
        })),

        setInitialEdges: (initialEdges: any[]) => set(produce((draft: FlowsStoreData) => {
            draft.initialEdges = initialEdges;
        })),
        setInitialNodes: (initialNodes: any[]) => set(produce((draft: FlowsStoreData) => {
            draft.initialNodes = initialNodes;
        })),
        setCustomComponents: (customComponents: any[]) => set(produce((draft: FlowsStoreData) => {
            draft.customComponents = customComponents;
        })),
        appendCustomComponents: (customComponents: any[]) => set(produce((draft: FlowsStoreData) => {
            const objectExists = (arr, obj) => {
                return arr.some(item => item.id === obj.id);
            }
            customComponents.forEach(obj => {
                if (!objectExists(draft.customComponents, obj)) {
                    draft.customComponents.push(obj);
                }
            });
        })),
        setNodeData: (id: string, data: any) => set(produce((draft: FlowsStoreData) => {
            draft.nodeData = { ...get().nodeData, [id]: { ...get().nodeData[id], ...data } };
        })),
        setNodesMetaData: (metadata:any) => set(produce((draft: FlowsStoreData) => {
            Object.keys(metadata).forEach(key => {
                if(!draft.nodeData[key]) {
                    draft.nodeData[key] = {}
                } 
                draft.nodeData[key]['_metadata'] = metadata[key]
            })
        })),
        setNodesData: (data: any) => set(produce((draft: FlowsStoreData) => {
            draft.nodeData = data;
        })),
        deletePropNodeData: (id: string, prop: any) => set(produce((draft: FlowsStoreData) => {
            var nData = { ...get().nodeData[id] }
            if (Object.keys(nData).includes(prop)) {
                delete nData[prop]
                draft.nodeData = { ...draft.nodeData, [id]: { ...nData } };
            } else {
                console.error('Error deleting the following "Property Node Data": ' + id)
                draft.nodeData = { ...draft.nodeData }
            }
        })),
        clearNodesData: () => set(produce((draft: FlowsStoreData) => {
            const filteredData = {}
            //TODO: Find what node data is necessary to remove the filter and let only the necessary one.
            const keys = Object.keys(get().nodeData).filter(key => !(key.startsWith('Object')
                || key.startsWith('ArrowFunction')
                || key.startsWith('TypeAliasDeclaration')
                || key.startsWith('InterfaceDeclaration')
                || key.startsWith('ObjectBindingPattern')
                || key.startsWith('JsxElement')
                || key.startsWith('JsxExpression')
                || key.startsWith('PropertyAssignment')
                || key.startsWith('FunctionDeclaration')
            ))
            keys.forEach(key => {
                filteredData[key] = get().nodeData[key];
            });
            draft.nodeData = filteredData;
        })),
        setSaveStatus: (status: null | 'loading' | 'error') => set(produce((draft: FlowsStoreData) => {
            draft.saveStatus = status;
        })),
        setTemeMode: (theme: 'light'|'dark', themeOverride) => set(produce((draft: FlowsStoreData) => {
            draft.themeMode = theme;
            draft.themeOverride = themeOverride;
        }))
    }));
}
export const FlowStoreContext = createContext(useFlowsStore())
