import { AutoModel, Schema, z } from 'protobase'

export const AgentDefinitionSchema = Schema.object({
  name: z.string().hint("Protofy screen controller...").static().id(),
  platform: z.string().hidden(),
  subsystems: z.record(z.string(), z.any()).optional().hidden(),
  environment: z.string().optional().help("The environment where the definition was created").hidden().groupIndex("env"),
  config: z.record(z.string(), z.any()).onCreate('getConfig').onUpdate('getConfig'),
})
export type AgentDefinitionType = z.infer<typeof AgentDefinitionSchema>;
export const AgentDefinitionModel = AutoModel.createDerived<AgentDefinitionType>("AgentDefinitionModel", AgentDefinitionSchema);