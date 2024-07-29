import { AutoModel, Schema, z } from 'protobase'

export const StateMachineSchema = Schema.object({
    name: Schema.string().id().static(),
})

export type StateMachineType = z.infer<typeof StateMachineSchema>;
export const StateMachineModel = AutoModel.createDerived<StateMachineType>("ObjectModel", StateMachineSchema);