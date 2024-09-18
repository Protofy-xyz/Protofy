import { z } from "protobase";
import { SubsystemType, SubsystemSchema } from '.'
export type DeviceDataType = {
    name: string,
    deviceDefinition: string,
    currentSdk: string,
    subsystem: SubsystemType[],
}


export const DeviceSchema = z.object({
    name: z.string(),
    deviceDefinition: z.string(),
    currentSdk: z.string(),
    subsystem: z.array(SubsystemSchema),
})