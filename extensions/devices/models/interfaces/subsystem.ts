import { z } from "protobase";
import { ActionSchema, ActionType, MonitorSchema, MonitorType } from "./";

export const SubsystemSchema = z.object({
    name: z.string(),
    type: z.string(),
    config: z.object({
        brokerUrl: z.string().optional(),
        frontendEndpoint: z.string().optional(),
        prefix: z.string().optional(),
        restoreMode: z.string().optional()
    }),
    actions: z.array(ActionSchema).optional(),
    monitors: z.array(MonitorSchema).optional(),
})

export type SubsystemType = {
    name: string,
    type: string,
    config: {
        brokerUrl?: string,
        frontendEndpoint?: string,
        prefix?: string,
        restoreMode?: string
    },
    actions?: ActionType[],
    monitors?: MonitorType[],
}
