import { ProtoModel, SessionDataType, API, Schema, z, AutoModel } from 'protobase'

export const AgentsSchema = Schema.object({
  name: z.string().hint("Agent name").static().regex(/^[a-z0-9_]+$/, "Only lower case chars, numbers or _").id().search(),
  subsystems: z.object({
    "monitors": z.array(z.record(z.string(), z.any())), 
    "actions": z.array(z.record(z.string(), z.any())), 
  }).optional(),
  platform: z.string(),
})
export type AgentsType = z.infer<typeof AgentsSchema>;
export const AgentsModel = AutoModel.createDerived<AgentsType>("AgentsModel", AgentsSchema);