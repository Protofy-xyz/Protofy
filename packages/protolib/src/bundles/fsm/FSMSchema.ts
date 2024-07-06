import { AutoModel, Schema, z } from 'protobase'

export const FSMSchema = Schema.object({
    name: Schema.string().id().static(),
    state: Schema.string(),
    transitions: Schema.array(z.string()),
    disabled: Schema.boolean()
}) 

export type FSMType = z.infer<typeof FSMSchema>;
export const FSMModel = AutoModel.createDerived<FSMType>("ObjectModel", FSMSchema);