import create from "zustand";
import produce from "immer";

type ZoomStoreData = {
    zoom: number,
    setZoom: Function
}

export const useZoomStore = create<ZoomStoreData>((set) => ({
    zoom: 0,
    setZoom: (payload) => set(produce((draft:ZoomStoreData) => {
        draft.zoom = payload;
    }))
}));