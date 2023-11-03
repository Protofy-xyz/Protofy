import { z } from "zod";
import { Schema } from 'protolib/base'
import { AutoModel } from 'protolib/base'
import { v4 as uuidV4 } from 'uuid';

export const DeviceCoreSchema = Schema.object({
    id: z.string().generate((obj) => uuidV4()),
    name: z.union([
        z.literal("ESP32"),
        z.literal("ESP32S3"),
        z.literal("RASPI-PICO"),
        z.literal(" AT-MEGA2560"),
        z.literal(" AT-MEGA3801"),
        z.literal("ARMv7"),
        z.literal("Protofy"),
    ]).hint("ESP32, AT-MEGA2560  ARMv7, Protofy, ...").display(),
    sdks: z.array(z.union([ 
        z.literal("esphome"),
        z.literal("platformio"),
        z.literal("arduino"),
        z.literal("micropython"),
        z.literal("python"),
        z.literal("javacript"),
        z.literal("C++"),
        z.literal("wled"),
        z.literal("protofyStarter"),
    ])).hint("esphome, platformio, wled, javascript, ...").display(),
    config: z.string().min(1).search().generate((obj) => 'admin')
})
export type DeviceCoreType = z.infer<typeof DeviceCoreSchema>;
export const DeviceCoreModel = AutoModel.createDerived<DeviceCoreType>("DeviceCoreModel", DeviceCoreSchema);