import { z } from "protolib/base";
import { Schema } from 'protolib/base'
import { AutoModel } from 'protolib/base'

export const DeviceCoreSchema = Schema.object({
  name: z.string().hint("ESP32, AT-MEGA2560  ARMv7, Protofy, ...").static().id(),
  sdks: z.array(z.string()).hint("esphome, platformio, wled, javascript, ..."),
  config: z.record(z.string(), z.string()).generate(() => { return {} })
})
export type DeviceCoreType = z.infer<typeof DeviceCoreSchema>;
export const DeviceCoreModel = AutoModel.createDerived<DeviceCoreType>("DeviceCoreModel", DeviceCoreSchema);