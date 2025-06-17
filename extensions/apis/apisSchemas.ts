import { Protofy, AutoModel, Schema, z } from 'protobase'

Protofy("features", {
    "adminPage": "/apis"
})

export const APISchema = Schema.object(Protofy("schema", {
    name: Schema.string().id().static()
})) 

Protofy("api", {
    "name": "apis",
    "prefix": "/api/core/v1/"
})

export type APIType = z.infer<typeof APISchema>;
export const APIModel = AutoModel.createDerived<APIType>("ObjectModel", APISchema);
