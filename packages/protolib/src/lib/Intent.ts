import { z } from 'protobase'
import { processFilesIntent } from '../bundles/files/intents'

export const IntentSchema = z.object({
    action: z.string(),
    domain: z.string(),
    data: z.any()
})

export type IntentType = z.infer<typeof IntentSchema>;

export const getIntent = (action: string, domain: string, data: any) => {
    IntentSchema.parse({action, domain, data})
    return {action, domain, data}
}  

export const useIntent = (intent: IntentType) => {
    //add your intents here
    return processFilesIntent(intent)
}