import { ProtoModel, SessionDataType } from "../../../base";
import { SubsystemSchema, SubsystemType } from "./interfaces";


export class SubsystemModel extends ProtoModel<SubsystemModel> {
    data: SubsystemType;
    session: SessionDataType;
    constructor(data?: SubsystemType, session?: SessionDataType) {
        super(data, SubsystemSchema, session)
    }
    getName(doubleQuotted?: boolean): string {
        return doubleQuotted ?( '"' + this.data?.name + '"' ):this.data?.name;
    }
}

export class SubsystemCollection {
    items: SubsystemType[];
    session: SessionDataType;
    constructor(items: SubsystemType[], session?: SessionDataType) {
        this.items = items;
        this.session = session
    }
    getNames(withAction?: boolean, doubleQuotted?: boolean): string[] { // if withAction is enabled return only subsystems that have "actions" to perform
        // if withAction is enabled return only subsystems that have "actions" to perform
        const subsystemNames = this.items?.reduce((total: string[], subsystem: SubsystemType) => {
            if (withAction) {
                if (subsystem?.actions && subsystem.actions?.length) {
                    return total.concat(subsystem.name);
                }
                else {
                    return total
                }
            }
            else {
                return total.concat(subsystem.name);
            }
        }, [])
        return doubleQuotted ? subsystemNames?.map(name => '"' + name + '"') : subsystemNames
    }
}