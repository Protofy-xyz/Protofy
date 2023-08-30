import create from "zustand";
import produce from "immer";
import Source from "../domain/Source";

type ProjectStoreData = {
    // Project variables
    currentTab: string,
    setCurrentTab: Function,
    projectChanges: boolean,
    onProjectChange: Function,
    selectedProjectNode: any,
    setSelectedProjectNode: Function,
    selectedPannel: string,
    setSelectedPannel: Function,
    // Shared variables
    sourceCode: string,
    setSourceCode: Function,
    currentPage: string, // Name of the page at url obtained from filename. e.g: ${filename}="/project/services/front/frontend/pages/Home.tsx", ${currentPage}="home"
    setCurrentPage: Function,
    monacoCode: string,  // Monaco tmp variable of current sourceCode editing at monaco
    setMonacoCode: Function,
    // Visualui
    craftNodes: any,
    setCraftNodes: Function,
    currentCraftNodeId: string, // CraftJS node id selected
    setCurrentCraftNodeId: Function,
    device: string,
    setDevice: Function, // Device selected as frame: ipad, iphone, pc, etc.
    // Flows
    saveStatusFlow: null | 'loading' | 'error',
    setSaveStatusFlow: Function,
    nodesPositions: any,
    setNodesPositions: Function,
}

export const useProjectStore = create<ProjectStoreData>((set, get) => ({
    currentTab: "project",
    selectedProjectNode: null,
    selectedPannel: null,
    sourceCode: "",
    monacoCode: "",
    currentPage: null,
    craftNodes: {},
    currentCraftNodeId: "",
    device: 'ipad11-horizontal',
    saveStatus: null,
    nodesPositions: null,
    projectChanges: false,
    setSourceCode: (data: string) => set(produce((draft: ProjectStoreData) => {
        draft.sourceCode = Source.formatText(data);
    })),
    setCurrentPage: (data: string) => set(produce((draft: ProjectStoreData) => {
        draft.currentPage = data;
    })),
    setDevice: (device: string) => set(produce((draft: ProjectStoreData) => {
        draft.device = device;
    })),
    setCurrentCraftNodeId: (nodeId: string) => set(produce((draft: ProjectStoreData) => {
        draft.currentCraftNodeId = nodeId;
    })),
    setCurrentTab: (currentTab: string) => set(produce((draft: ProjectStoreData) => {
        draft.currentTab = currentTab;
    })),
    setSelectedProjectNode: (id: string | undefined) => set(produce((draft: ProjectStoreData) => {
        draft.selectedProjectNode = id;
    })),
    setSelectedPannel: (payload: "ui" | "flows" | "monaco") => set(produce((draft: ProjectStoreData) => {
        draft.selectedPannel = payload;
    })),
    setCraftNodes: (payload: any) => set(produce((draft: ProjectStoreData) => {
        draft.craftNodes = payload;
    })),
    setMonacoCode: (payload: string) => set(produce((draft: ProjectStoreData) => {
        draft.monacoCode = payload;
    })),
    setSaveStatus: (status: null | 'loading' | 'error') => set(produce((draft: ProjectStoreData) => {
        draft.saveStatusFlow = status;
    })),
    setNodesPositions: (payload: any) => set(produce((draft: ProjectStoreData) => {
        draft.nodesPositions = payload;
    })),
    onProjectChange:  () => set(produce((draft: ProjectStoreData) => {
        draft.projectChanges = !get().projectChanges;
    })),

}));