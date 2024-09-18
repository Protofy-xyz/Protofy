import { AutoModel, Schema, z } from 'protobase'
import { v4 as uuidv4 } from 'uuid'

export const DeviceSdkSchema = Schema.object({
  id: z.string().generate(uuidv4()).id(),
  name: z.string().hint("MicroPython, Platformio...").static(),
  config: z.record(z.string().optional(), z.any()).generate({})
})
export type DeviceSdkType = z.infer<typeof DeviceSdkSchema>;
export const DeviceSdkModel = AutoModel.createDerived<DeviceSdkType>("DeviceSdkModel", DeviceSdkSchema);