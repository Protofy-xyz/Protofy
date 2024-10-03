import { z } from 'protobase'

export const MonitorSchema = z.object({
    name: z.string(),
    label: z.string(),
    description: z.string(),
    endpoint: z.string().nullable(),
})

export type MonitorType = {
    name: string,
    label: string,
    description: string,
    endpoint: string | null,
}

export const ActionSchema = z.object({
    name: z.string(),
    label: z.string(),
    description: z.string(),
    endpoint: z.string().nullable(),
    arguments: z.record(z.string(), z.any())
})

export type ActionType = {
    name: string,
    label: string,
    description: string,
    endpoint: string,
    arguments: object,
}

export const SubsystemsSchema = z.object({
    "monitors": z.array(MonitorSchema),
    "actions": z.array(ActionSchema),
})