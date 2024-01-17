import { z } from "protolib/base";
import { Schema } from 'protolib/base'
import { AutoModel } from 'protolib/base'

export const DevicesSchema = Schema.object({
  name: z.string().hint("Device name").static().regex(/^[a-z0-9A-Z]+$/, "Only lower case chars or numbers").id().search(),
  deviceDefinition: z.string().hidden(),
  substitutions: z.record(z.string().optional(), z.any().optional()).optional(),
  subsystem: z.record(z.string(), z.any()).optional(),
  data: z.array(z.record(z.string(), z.any())).optional()
})
export type DevicesType = z.infer<typeof DevicesSchema>;
export const DevicesModel = AutoModel.createDerived<DevicesType>("DevicesModel", DevicesSchema);
