import { z } from "protobase";

export const MonitorSchema = z.object({
    name: z.string(),
    label: z.string(),
    description: z.string(),
    endpoint: z.string(),
    connectionType: z.string(),
})

export type MonitorType = {
    name: string,
    label: string,
    description: string,
    endpoint: string,
    connectionType: string | "mqtt",
}