import { z } from "zod";
import {BaseSchema} from 'protolib/base'
import { AutoModel, Schema } from 'protolib/base'

export const APISchema = Schema.object({

}) 

export type APIType = z.infer<typeof APISchema>;
export const APIModel = AutoModel.createDerived<APIType>("ObjectModel", APISchema);
