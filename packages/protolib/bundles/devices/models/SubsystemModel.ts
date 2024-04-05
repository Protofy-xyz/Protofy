import { ProtoModel, SessionDataType } from "../../../base";
import { ActionType, MonitorType, SubsystemSchema, SubsystemType } from "./interfaces";


export class SubsystemModel extends ProtoModel<SubsystemModel> {
    data: SubsystemType;
    session: SessionDataType;
    constructor(data?: SubsystemType, session?: SessionDataType) {
        super(data, SubsystemSchema, session)
    }
    getName(doubleQuotted?: boolean): string {
        return doubleQuotted ? this.data?.name : this.data?.name;
    }

    getActionByName(name: string): ActionType {
        return this.getActions()?.find((action) => action.name === name);
    }

    getMonitorByName(name: string): MonitorType {
        return this.getMonitors()?.find((monitor) => monitor.name === name);
    }

    getActions(): ActionType[] {
        return this.data?.actions ?? [];
    }

    getMonitors(): MonitorType[] {
        return this.data?.monitors ?? [];
    }

    getActionsNames(doubleQuotted?: boolean): string[] {
        return this.getActions()?.map((action: ActionType) => doubleQuotted ? action.name : action?.name) ?? []
    }

    getMonitorsNames(doubleQuotted?: boolean): string[] {
        return this.getMonitors()?.map((monitor: MonitorType) => doubleQuotted ? monitor.name : monitor?.name) ?? []
    }

}

export class SubsystemCollection {
    items: SubsystemType[];
    session: SessionDataType;
    constructor(items: SubsystemType[], session?: SessionDataType) {
        this.items = items;
        this.session = session
    }
    findByName(name: string, doubleQuotted?: boolean): SubsystemType {
        return this.items?.find((subsystem: SubsystemType) => (doubleQuotted ? (subsystem.name) : subsystem.name) === name)
    }
    getNames(type?: "action" | "monitor", doubleQuotted?: boolean): string[] { // if withAction is enabled return only subsystems that have "actions" to perform
        // if withAction is enabled return only subsystems that have "actions" to perform
        const subsystemNames = this.items?.reduce((total: string[], subsystem: SubsystemType) => {
            switch (type) {
                case 'action':
                    if (subsystem?.actions && subsystem.actions?.length) {
                        return total.concat(subsystem.name);
                    }
                    else {
                        return total
                    }
                case 'monitor':
                    if (subsystem?.monitors && subsystem.monitors?.length) {
                        return total.concat(subsystem.name);
                    }
                    else {
                        return total
                    }
                default:
                    return total.concat(subsystem.name);
            }
        }, [])
        return doubleQuotted ? subsystemNames?.map(name => name) : subsystemNames
    }
}