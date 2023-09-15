import create from "zustand";
import produce from "immer";

type EditorStoreData = {
    isSourceCodeVisible: boolean | undefined,
    device: string,
    parser: any,
    currentPageContent: string,
    currentNodeId: string,
    currentPageInitialJson: any,
    setIsSourceCodeVisible: Function,
    setParser: Function,
    setCurrentPageContent: Function,
    setCurrentNodeId: Function,
    setCurrentPageInitialJson: Function,
}

export const useEditorStore = create<EditorStoreData>((set, get) => ({
    isSourceCodeVisible: undefined,
    device: 'ipad11-horizontal',
    parser: undefined,
    currentPageContent: "",
    currentNodeId: "",
    currentPageInitialJson: {},
    setIsSourceCodeVisible: (isVisible) => set(produce((draft: EditorStoreData) => {
        draft.isSourceCodeVisible = isVisible
    })),
    setCurrentNodeId: (nodeId: string) => set(produce((draft: EditorStoreData) => {
        draft.currentNodeId = nodeId;
    })),
    setParser: (_parser: any) => set(produce((draft: EditorStoreData) => {
        draft.parser = _parser;
    })),
    setCurrentPageContent: (content: string) => set(produce((draft: EditorStoreData) => {
        draft.currentPageContent = content;
    })),
    setCurrentPageInitialJson: (initialContent: any) => set(produce((draft: EditorStoreData) => {
        draft.currentPageInitialJson = initialContent;
    })),
}));