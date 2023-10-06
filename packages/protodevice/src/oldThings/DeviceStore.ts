import create from "zustand";
import produce from "immer";

type DeviceStoreData = {
    devicesList: [],
    electronicDevice: string,
    setDevicesList: Function,
    setElectronicDevice: Function,
}

export const useDeviceStore = create<DeviceStoreData>((set,get) => ({
    devicesList: {},
    electronicDevice: "mydevice",
    setElectronicDevice: (electronicDevice: string) => set(produce((draft: DeviceStoreData) => {
        draft.electronicDevice = electronicDevice
    })),
    setDevicesList: (devices: []) => set(produce((draft: DeviceStoreData) => {
        draft.devicesList = devices
    })),
}));