import { ProtoModel, SessionDataType } from "protobase";
import { ActionType, MonitorType, SubsystemSchema, SubsystemType } from "./interfaces";


export class SubsystemModel extends ProtoModel<SubsystemModel> {
    data: SubsystemType;
    session: SessionDataType;
    constructor(data?: SubsystemType, session?: SessionDataType) {
        super(data, SubsystemSchema, session)
    }
    getName(): string {
        return this.data?.name;
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

    getHandlersNames(type: "action" | "monitor"): string[] {
        switch (type) {
            case 'action':
                return this.getActionsNames()
            case 'monitor':
                return this.getMonitorsNames()
        }
    }

    getActionsNames(): string[] {
        return this.getActions()?.map((action: ActionType) => action?.name) ?? []
    }

    getMonitorsNames(): string[] {
        return this.getMonitors()?.map((monitor: MonitorType) => monitor?.name) ?? []
    }

}

export class SubsystemCollection {
    items: SubsystemType[];
    session: SessionDataType;
    constructor(items: SubsystemType[], session?: SessionDataType) {
        this.items = items;
        this.session = session
    }
    findByName(name: string): SubsystemType {
        return this.items?.find((subsystem: SubsystemType) => subsystem?.name === name)
    }
    getNames(type?: "action" | "monitor"): string[] { // if withAction is enabled return only subsystems that have "actions" to perform
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
        return subsystemNames
    }
}