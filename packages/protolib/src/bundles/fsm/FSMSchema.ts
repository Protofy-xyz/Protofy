import { AutoModel, Schema, z } from 'protobase'

export const FSMSchema = Schema.object({
    name: Schema.string().id().static(),
    context: Schema.record(z.string(), z.any()),
    states: Schema.array(z.string()),
    transitions: Schema.record(z.string(), z.record(z.string(), z.string())),
    currentState: Schema.union([z.literal(""), z.literal("")]).dependsOn("states").generateOptions((data) => [...data.states])
})

export type FSMType = z.infer<typeof FSMSchema>;
export const FSMModel = AutoModel.createDerived<FSMType>("ObjectModel", FSMSchema);