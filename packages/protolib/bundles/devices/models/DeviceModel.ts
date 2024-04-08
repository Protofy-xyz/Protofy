import { ProtoModel, SessionDataType } from "../../../base";
import { SubsystemCollection } from "./SubsystemModel";
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