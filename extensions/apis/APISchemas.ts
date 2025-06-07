import { AutoModel, Schema, z } from 'protobase'

export const APISchema = Schema.object({
    name: Schema.string().id().static()
}) 

export type APIType = z.infer<typeof APISchema>;
export const APIModel = AutoModel.createDerived<APIType>("ObjectModel", APISchema);
