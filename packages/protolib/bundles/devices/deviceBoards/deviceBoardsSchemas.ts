import { AutoModel, Schema, z } from '../../../base'

export const DeviceBoardSchema = Schema.object({
  name: z.string().hint("ESP32S3, CHUWI, Arduino UNO...").static().id(),
  core: z.string().hidden(),
  ports: z.array(z.record(z.string(), z.any())),
  config: z.record(z.string(), z.any()),
})
export type DeviceBoardType = z.infer<typeof DeviceBoardSchema>;
export const DeviceBoardModel = AutoModel.createDerived<DeviceBoardType>("DeviceBoardModel", DeviceBoardSchema);