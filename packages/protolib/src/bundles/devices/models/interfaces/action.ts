import { z } from "../../../../base";

export const ActionSchema = z.object({
    name: z.string(),
    label: z.string(),
    description: z.string(),
    endpoint: z.string(),
    connectionType: z.string(),
})

export type ActionType = {
    name: string,
    label: string,
    description: string,
    endpoint: string,
    connectionType: string | "mqtt",
    payload?: {
        type: string | "str";
        value: string
    }
}