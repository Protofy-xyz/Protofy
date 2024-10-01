import { z } from 'protobase'

export const MonitorSchema = z.object({
    name: z.string(),
    label: z.string(),
    description: z.string(),
    endpoint: z.string(),
})

export const ActionSchema = z.object({
    name: z.string(),
    label: z.string(),
    description: z.string(),
    endpoint: z.string(),
    arguments: z.record(z.string(), z.any())
})

export const SubsystemsSchema = z.object({
    "monitors": z.array(MonitorSchema),
    "actions": z.array(ActionSchema),
})