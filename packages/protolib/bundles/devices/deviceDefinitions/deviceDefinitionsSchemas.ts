import { z } from "protolib/base";
import { Schema } from 'protolib/base'
import { AutoModel } from 'protolib/base'

export const DeviceDefinitionSchema = Schema.object({
  name: z.string().hint("Protofy screen controller...").display().static().id(),
  board: z.string(),
  sdk: z.string(),
  subsystems: z.record(z.string(), z.any()).optional(),
  config: z.record(z.string(), z.any()).display(),
})
export type DeviceDefinitionType = z.infer<typeof DeviceDefinitionSchema>;
export const DeviceDefinitionModel = AutoModel.createDerived<DeviceDefinitionType>("DeviceDefinitionModel", DeviceDefinitionSchema); 