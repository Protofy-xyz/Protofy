import { z } from "protolib/base";
import { Schema } from 'protolib/base'
import { AutoModel } from 'protolib/base'

export const DevicesSchema = Schema.object({
  name: z.string().hint("Device name").display().static().regex(/^[a-z]+$/, "Only lower case chars").id(),
  deviceDefinition: z.string(),
  subsystem: z.record(z.string(), z.any()).optional(),
  data: z.array(z.record(z.string(), z.any())).display().optional()
})
export type DevicesType = z.infer<typeof DevicesSchema>;
export const DevicesModel = AutoModel.createDerived<DevicesType>("DevicesModel", DevicesSchema);
