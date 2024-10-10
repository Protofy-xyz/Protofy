import { ProtoModel, SessionDataType, API, Schema, z, AutoModel } from 'protobase'
import { MonitorType, SubsystemSchema, SubsystemType } from './subsystemSchemas';


export const AgentsSchema = Schema.object({
    name: z.string().hint("Agent name").static().regex(/^[a-z0-9_]+$/, "Only lower case chars, numbers or _").id().search(),
    subsystems: z.array(SubsystemSchema).optional().hidden(),
    platform: z.string(),
})
export type AgentsType = z.infer<typeof AgentsSchema>;
// export const AgentsModel = AutoModel.createDerived<AgentsType>("AgentsModel", AgentsSchema);

export class AgentsModel extends ProtoModel<AgentsModel> {
    constructor(data: AgentsType, session?: SessionDataType,) {
        super(data, AgentsSchema, session, "AgentsModel");
    }

    getEnvironment() {
        return this.data.environment ?? 'dev'
    }

    hasEnvironment(env: string) {
        return (!this.data.environment && env == 'dev') || this.data.environment == env
    }

    public static getApiOptions() {
        return {
            name: 'adminapi',
            prefix: '/api/v1/'
        }
    }

    isInitialized() {
        return this.data?.subsystem ? true : false
    }

    async setSubsystems(subsystems: any) {
        const agentObject = await API.get("/adminapi/v1/agents/" + this.data.name)
        if (agentObject.isError) {
            console.error(agentObject.error)
            return;
        }


        agentObject.data.subsystems = subsystems
        API.post("/adminapi/v1/agents/" + this.data.name, agentObject.data)
    }

    getSubsystem(name: string): SubsystemType | null {
        return this.data.subsystems && this.data.subsystems.length ? this.data.subsystems.find(sub => sub.name === name) : null
    }

    getMonitor(subsystemName: string, monitorName: string) {
        const subsystem = this.getSubsystem(subsystemName)
        return subsystem.monitors && subsystem.monitors.length ? subsystem.monitors.find(monitor => monitor.name === monitorName) : null
    }


    create(data?): AgentsModel {
        const result = super.create(data)
        return result
    }

    read(extraData?): AgentsType {
        const result = super.read(extraData)
        return result
    }

    update(updatedModel: AgentsModel, data?: AgentsType): AgentsModel {
        const result = super.update(updatedModel, data)
        return result
    }


    list(search?, session?, extraData?, params?): any {
        if (params && params.filter && params.filter.environment) {
            const { environment, ...filter } = params.filter
            if (!this.hasEnvironment(environment)) {
                return
            }
            params = {
                ...params,
                filter: {
                    ...filter,
                }
            }
        }

        return super.list(search, session, extraData, params)
    }

    delete(data?): AgentsModel {
        const result = super.delete(data)
        return result
    }

    protected static _newInstance(data: any, session?: SessionDataType): AgentsModel {
        return new AgentsModel(data, session);
    }

    static load(data: any, session?: SessionDataType): AgentsModel {
        return this._newInstance(data, session);
    }
}
