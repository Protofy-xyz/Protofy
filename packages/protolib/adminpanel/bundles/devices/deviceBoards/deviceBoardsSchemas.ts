import { z } from "zod";
import { Schema } from 'protolib/base'
import { AutoModel } from 'protolib/base'
import { v4 as uuidV4 } from 'uuid';
import { DeviceCoreSchema } from "../devicecores";

export const DeviceBoardSchema = Schema.object({
  id: z.string().generate((obj) => uuidV4()),
  name: z.union([
    z.literal("PROTOFY ESP32 DEV BOARD"),
    z.literal("ESP32S3"),
    z.literal("Arduino UNO"),
    z.literal("Raspberry pi 3"),
    z.literal("PROTOFY NEOPIXEL CONTROLLER"),
    z.literal("CHUWI"),
  ]).hint("ESP32S3, CHUWI, Arduino UNO...").display(),
  core: DeviceCoreSchema.display(),
  ports: z.array(z.any()).display(),
  config: z.object({
    clockFreq: z.number().optional()
  })
})
export type DeviceBoardType = z.infer<typeof DeviceBoardSchema>;
export const DeviceBoardModel = AutoModel.createDerived<DeviceBoardType>("DeviceBoardModel", DeviceBoardSchema);