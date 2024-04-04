import { ProtoModel, SessionDataType } from "../../../base";
import { SubsystemCollection } from "./SubsystemModel";
import { DeviceDataType, DeviceSchema, SubsystemType } from "./interfaces";


export class DeviceModel extends ProtoModel<DeviceModel> {
    data: DeviceDataType;
    session: SessionDataType;
    constructor(data?: DeviceDataType, session?: SessionDataType) {
        super(data, DeviceSchema, session)
    }
    getName(doubleQuotted?: boolean): string {
        return doubleQuotted ? ('"' + this.data?.name + '"') : this.data?.name;
    }
    getSubsystems(): SubsystemType[] {
        return this.data?.subsystem
    }
    getSubsystemNames(withAction?: boolean, doubleQuotted?: boolean): string[] {
        // if withAction is enabled return only subsystems that have "actions" to perform
        const subsystemCollection = new SubsystemCollection(this.getSubsystems());
        return subsystemCollection?.getNames(withAction, doubleQuotted) ?? []
    }
}

export class DeviceCollection {
    items: DeviceDataType[];
    session: SessionDataType;
    constructor(items: DeviceDataType[], session?: SessionDataType) {
        this.items = items;
        this.session = session
    }
    findByName(name: string, doubleQuotted): DeviceDataType {
        return this?.items.find((device) => (doubleQuotted ? ('"' + device.name + '"'): device.name) === name)
    }
    getNames(doubleQuotted?: boolean): string[] {
        return this?.items?.map((device: DeviceDataType) => doubleQuotted ? '"' + device?.name + '"' : device?.name) ?? []
    }
    getIndexByName(name: string): number {
        return this?.items?.findIndex((device) => device.name === name)
    }
    getSubsystemsByDeviceName(doubleQuotted?: boolean): any {
        return this.items?.reduce((total, device) => {
            const deviceModel = new DeviceModel(device)
            const deviceName = deviceModel.getName(doubleQuotted);
            const subsystemNames: string[] = deviceModel.getSubsystemNames(true, doubleQuotted)
            total[deviceName] = subsystemNames
            return total
        }, {})
    }
}