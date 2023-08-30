import create from "zustand";
import produce from "immer";
import { availableThemes } from "../themes";
import OpenAIAPI from "../api/OpenAIAPI";
import { capitalizeFirstLetter } from '../utils/utils';
import Screens from '../Screens';
import { Document } from "../components";

type OpenAIStoreData = {
    description: string,
    setDescription: Function,
    generateExampleText: Function,
    modalVisible: boolean,
    setModalVisible: Function
}

export const useOpenAIStore = create<OpenAIStoreData>((set, get) => ({
    description: '',
    modalVisible: false,
    setDescription: (description: string) => set(produce((draft: OpenAIStoreData) => {
        draft.description = description;
    })),
    setModalVisible: (visible: boolean) => set(produce((draft: OpenAIStoreData) => {
        draft.modalVisible = visible;
    })),
    generateExampleText: async (description: string) => {
        try {
            const data = await OpenAIAPI.generateExampleText(description)
            const exampleText = data.exampleText
            get().setDescription(exampleText)
            console.log('GENERATED EXAMPLE TEXT: ', data)
        } catch (e) { console.error(`Error generating example text for ${description}. Error ${e}`) }
    }
}));