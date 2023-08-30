import create from "zustand";
import produce from "immer";
import EditorApi from "../api/EditorApi";
import { capitalizeFirstLetter } from '../utils/utils';
import { Document } from "../components";

type EditorStoreData = {
    isSourceCodeVisible: boolean | undefined,
    setIsSourceCodeVisible: Function,
    play: Function,
    stop: Function,
    activeMonaco: Function,
    device: string,
    setDevice: Function,
    pages: Document[],
    setPages: Function,
    listPages: Function,
    createPage: Function,
    parser: any,
    setParser: Function,
    currentPageContent: string,
    setCurrentPageContent: Function,
    currentPage: string | undefined,
    setCurrentPage: Function,
    currentTab: string | undefined,
    setCurrentTab: Function,
    currentNodeId: string,
    setCurrentNodeId: Function,
    currentPageInitialJson: any,
    setCurrentPageInitialJson: Function,
    toggleCode: Function,
    saveSourceCode: Function
}

export const useEditorStore = create<EditorStoreData>((set, get) => ({
    isSourceCodeVisible: undefined,
    device: 'ipad11-horizontal',
    pages: [],
    parser: undefined,
    currentPageContent: "",
    currentNodeId: "",
    devicesList: {},
    currentPageInitialJson: {},
    electronicDevice: "mydevice",
    // currentPage: Screens?.find((screen) => screen?.fallback)?.name ?? 'home',
    currentPage: undefined,
    currentTab: undefined,
    setDevice: (device: string) => set(produce((draft: EditorStoreData) => {
        draft.device = device;
    })),
    setIsSourceCodeVisible: (isVisible) => set(produce((draft: EditorStoreData) => {
        draft.isSourceCodeVisible = isVisible
    })),
    toggleCode: () => set(produce((draft: EditorStoreData) => {
        draft.isSourceCodeVisible = !get().isSourceCodeVisible
    })),
    setPages: (pages: Document[]) => set(produce((draft: EditorStoreData) => {
        draft.pages = pages;
    })),
    setCurrentNodeId: (nodeId: string) => set(produce((draft: EditorStoreData) => {
        draft.currentNodeId = nodeId;
    })),
    listPages: async () => {
        try {
            const pageNames: string[] = await EditorApi.getPages()
            const _pages: Document[] = pageNames.map((pageName: string) => { return ({ title: pageName.toLowerCase(), icon: "ts" }) })
            get().setPages(_pages)
            const val = get().currentPage
            if (_pages.find(a => a.title === val)) {
                get().setCurrentPage(val)
            }
        } catch (e) { console.error(`Error getting pages. Error ${e}`) }
    },
    createPage: async (pageName: string, templateName?: string) => {
        const _pageName: string = capitalizeFirstLetter(pageName)
        try {
            if (get().pages?.find((page: Document) => page.title == _pageName)) {
                console.error(`Error crendo pagina. La pagina ${_pageName} ya existe`)
                return;
            }
            await EditorApi.createPage(_pageName, templateName)
            await get().listPages()
        } catch (e) { console.error(`Error creating page ${_pageName}. Error ${e}`) }
    },
    deletePage: async (pageName: string) => {
        const _pageName: string = capitalizeFirstLetter(pageName)
        try {
            await EditorApi.deletePage(_pageName)    
            await get().listPages()
        } catch (e) { console.error(`Error deleting page ${pageName}. Error: ${e}`) }
    },
    setParser: (_parser: any) => set(produce((draft: EditorStoreData) => {
        draft.parser = _parser;
    })),
    setCurrentPageContent: (content: string) => set(produce((draft: EditorStoreData) => {
        draft.currentPageContent = content;
    })),
    setCurrentPage: (pageName: string) => set(produce((draft: EditorStoreData) => {
        draft.currentPage = pageName;
    })),
    setCurrentTab: (currentTab: string) => set(produce((draft: EditorStoreData) => {
        draft.currentTab = currentTab;
    })),
    setCurrentPageInitialJson: (initialContent: any) => set(produce((draft: EditorStoreData) => {
        draft.currentPageInitialJson = initialContent;
    })),
}));