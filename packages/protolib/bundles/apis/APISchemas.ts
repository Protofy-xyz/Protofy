import { z } from "protolib/base";
import { AutoModel, Schema } from 'protolib/base'

export const APISchema = Schema.object({
    name: Schema.string().id().static()
}) 

export type APIType = z.infer<typeof APISchema>;
export const APIModel = AutoModel.createDerived<APIType>("ObjectModel", APISchema);
