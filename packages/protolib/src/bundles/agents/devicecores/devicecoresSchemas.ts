import { AutoModel, Schema, z } from 'protobase'

export const DeviceCoreSchema = Schema.object({
  name: z.string().hint("ESP32, AT-MEGA2560  ARMv7, Protofy, ...").static().id(),
  sdks: z.array(z.string()).hint("esphome, platformio, wled, javascript, ...").hidden(),
  config: z.record(z.string(), z.any()).optional().onCreate('getConfig').onUpdate('getConfig'),
})
export type DeviceCoreType = z.infer<typeof DeviceCoreSchema>;
export const DeviceCoreModel = AutoModel.createDerived<DeviceCoreType>("DeviceCoreModel", DeviceCoreSchema);