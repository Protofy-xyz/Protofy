import { ProtoModel, SessionDataType } from "../../../base";
import { SubsystemCollection, SubsystemModel } from "./SubsystemModel";
import { DeviceDataType, DeviceSchema, SubsystemType } from "./interfaces";


export class DeviceModel extends ProtoModel<DeviceModel> {
    data: DeviceDataType;
    session: SessionDataType;
    constructor(data?: DeviceDataType, session?: SessionDataType) {
        super(data, DeviceSchema, session)
    }
    getName(): string {
        return this.data?.name;
    }
    getSubsystems(): SubsystemType[] {
        return this.data?.subsystem
    }
    getSubsystemNames(type?: "action" | "monitor"): string[] {
        const subsystemCollection = new SubsystemCollection(this.getSubsystems());
        return subsystemCollection?.getNames(type) ?? []
    }
}

export class DeviceCollection {
    items: DeviceDataType[];
    session: SessionDataType;
    constructor(items: DeviceDataType[], session?: SessionDataType) {
        this.items = items;
        this.session = session
    }

    findByName(name: string): DeviceDataType {
        return this?.items.find((device) => device.name === name)
    }

    getNames(): string[] {
        return this?.items?.map((device: DeviceDataType) => device?.name) ?? []
    }

    getDeviceByName(name: string): DeviceModel {
        const selectedDevice: DeviceDataType = this.findByName(name);
        return new DeviceModel(selectedDevice)
    }

    getSubsystemByName(deviceName: string, deviceComponent: string): SubsystemModel {
        const selectedDeviceModel = this.getDeviceByName(deviceName)
        const deviceSubsystems = selectedDeviceModel.getSubsystems()
        const subsystemsCollection = new SubsystemCollection(deviceSubsystems);
        const selectedSubsystem: SubsystemType = subsystemsCollection.findByName(deviceComponent);
        return new SubsystemModel(selectedSubsystem)
    }

    getSubsystemsNames(deviceName: string, handlerType: "monitor" | "action"): string[] {
        const selectedDeviceModel = this.getDeviceByName(deviceName)
        return selectedDeviceModel.getSubsystemNames(handlerType) ?? [];
    }

    getSubsystemHandler(deviceName: string, deviceComponent: string, handlerType: "monitor" | "action"): string[] {
        const selectedSubsystemModel = this.getSubsystemByName(deviceName, deviceComponent)
        return selectedSubsystemModel.getHandlersNames(handlerType)
    }

    getSubsystemAction(deviceName: string, deviceComponent: string, deviceAction: string): any {
        const selectedSubsystemModel = this.getSubsystemByName(deviceName, deviceComponent)

        return selectedSubsystemModel.getActionByName(deviceAction)
    }

    getIndexByName(name: string): number {
        return this?.items?.findIndex((device) => device.name === name)
    }

    getSubsystemsByDeviceName(): any {
        return this.items?.reduce((total, device) => {
            const deviceModel = new DeviceModel(device)
            const deviceName = deviceModel.getName();
            const subsystemNames: string[] = deviceModel.getSubsystemNames(null)
            total[deviceName] = subsystemNames
            return total
        }, {})
    }
}