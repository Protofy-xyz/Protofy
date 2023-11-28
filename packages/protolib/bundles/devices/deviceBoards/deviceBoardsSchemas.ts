import { z } from "protolib/base";
import { Schema } from 'protolib/base'
import { AutoModel } from 'protolib/base'

export const DeviceBoardSchema = Schema.object({
  name: z.string().hint("ESP32S3, CHUWI, Arduino UNO...").display().static().id(),
  core: z.string(),
  ports: z.array(z.record(z.string(), z.any())).display(),
  config: z.record(z.string(), z.any()).display(),
})
export type DeviceBoardType = z.infer<typeof DeviceBoardSchema>;
export const DeviceBoardModel = AutoModel.createDerived<DeviceBoardType>("DeviceBoardModel", DeviceBoardSchema);