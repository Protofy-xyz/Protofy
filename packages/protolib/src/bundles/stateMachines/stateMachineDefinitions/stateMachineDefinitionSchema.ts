import { AutoModel, Schema, z } from 'protobase'

export const StateMachineDefinitionSchema = Schema.object({
    name: Schema.string().id().static(),
    context: Schema.record(z.string(), z.any()),
    states: Schema.array(z.string()),
    transitions: Schema.record(z.string(), z.record(z.string(), z.string())),
})

export type StateMachineDefinitionType = z.infer<typeof StateMachineDefinitionSchema>;
export const StateMachineDefinitionModel = AutoModel.createDerived<StateMachineDefinitionType>("ObjectModel", StateMachineDefinitionSchema);