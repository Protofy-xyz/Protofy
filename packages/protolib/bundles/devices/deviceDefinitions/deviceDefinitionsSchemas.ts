import { AutoModel, Schema, z } from '../../../base'

export const DeviceDefinitionSchema = Schema.object({
  name: z.string().hint("Protofy screen controller...").static().id(),
  board: z.string().hidden(),
  sdk: z.string().hidden(),
  subsystems: z.record(z.string(), z.any()).optional().hidden(),
  environment: z.string().optional().help("The environment where the definition was created").hidden().groupIndex("env"),
  config: z.record(z.string(), z.any()).onCreate('getConfig').onUpdate('getConfig'),
})
export type DeviceDefinitionType = z.infer<typeof DeviceDefinitionSchema>;
export const DeviceDefinitionModel = AutoModel.createDerived<DeviceDefinitionType>("DeviceDefinitionModel", DeviceDefinitionSchema); 