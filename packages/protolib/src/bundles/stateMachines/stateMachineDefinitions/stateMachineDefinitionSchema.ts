import { AutoModel, ProtoModel, Schema, SessionDataType, z } from 'protobase'

export const StateMachineDefinitionSchema = Schema.object({
    name: z.string().id().static().search(),
    context: Schema.record(z.string(), z.any()),
    states: Schema.array(z.string()),
})

export type StateMachineDefinitionType = z.infer<typeof StateMachineDefinitionSchema>;
//export const StateMachineDefinitionModel = AutoModel.createDerived<StateMachineDefinitionType>("ObjectModel", StateMachineDefinitionSchema);

export class StateMachineDefinitionModel extends ProtoModel<StateMachineDefinitionModel> {
    constructor(data: StateMachineDefinitionType, session?: SessionDataType,) {
        super(data, StateMachineDefinitionSchema, session, "StateMachineDefinitionModel");
    }

    public static getApiOptions() {
        return {
            name: 'statemachinedefinition',
            prefix: '/adminapi/v1/'
        }
    }

    create(data?): StateMachineDefinitionModel {
        const result = super.create(data)
        return result
    }

    read(extraData?): StateMachineDefinitionType {
        const result = super.read(extraData)
        return result
    }

    update(updatedModel: StateMachineDefinitionModel, data?: StateMachineDefinitionType): StateMachineDefinitionModel {
        const result = super.update(updatedModel, data)
        return result
    }

    list(search?, session?, extraData?, params?): StateMachineDefinitionType[] {
        const result = super.list(search, session, extraData, params)
        return result
    }

    delete(data?): StateMachineDefinitionModel {
        const result = super.delete(data)
        return result
    }

    protected static _newInstance(data: any, session?: SessionDataType): StateMachineDefinitionModel {
        return new StateMachineDefinitionModel(data, session);
    }

    static load(data: any, session?: SessionDataType): StateMachineDefinitionModel {
        return this._newInstance(data, session);
    }
}