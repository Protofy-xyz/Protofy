import { z } from 'protobase'

export const MonitorSchema = z.object({
    name: z.string(),
    label: z.string(),
    type: z.string(),
    ephemeral: z.boolean().generate(() => false),
    description: z.string(),
    endpoint: z.string().nullable(),
})

export type MonitorType = {
    name: string,
    label: string,
    type: string,
    description: string,
    endpoint: string | null,
}

export const ActionSchema = z.object({
    name: z.string(),
    label: z.string(),
    type: z.string(),
    description: z.string(),
    endpoint: z.string().nullable(),
    arguments: z.record(z.string(), z.any()).nullable(),
    // payload: z.any().nullable().optional()
})

export type ActionType = {
    name: string,
    label: string,
    type: string,
    description: string,
    endpoint: string,
    arguments: object,
    payload: {
        type: string,
        value: string
    }
}

export const SubsystemSchema = z.object({
    "name": z.string(),
    "monitors": z.array(MonitorSchema),
    "actions": z.array(ActionSchema),
})

export type SubsystemType = {
    name: string, 
    monitors: MonitorType[], 
    actions: ActionType[]
}

export const SubsystemsSchema = z.array(SubsystemSchema)